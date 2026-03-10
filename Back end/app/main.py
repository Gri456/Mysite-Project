from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db import SessionLocal, mongo_db
from .models import User
from .schemas import SignUpIn, LoginIn, TokenOut, PurchaseIn, PurchaseOut, OAuthLoginIn
from .auth import hash_password, verify_password, make_jwt
import jwt
import os
import uuid
from datetime import datetime

app = FastAPI(title="BitJourney API")

# Permitir o front do XAMPP (ajusta se precisares)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_uuid(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv("JWT_SECRET", "secret"), algorithms=[os.getenv("JWT_ALG", "HS256")])
        return payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/auth/signup") # Removed response_model to match legacy frontend response expectations if needed
def signup(payload: SignUpIn, db: Session = Depends(get_db)):
    if db.get(User, payload.uuid):
        return {"ok": False, "error": "UUID already registered"}
    db.add(User(uuid=payload.uuid, password_hash=hash_password(payload.password)))
    db.commit()
    return {"ok": True, "access_token": make_jwt(payload.uuid)}

@app.post("/auth/login") # Removed response_model logic slightly to output "ok" wrapping
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.get(User, payload.uuid)
    if not user or not verify_password(payload.password, user.password_hash):
        return {"ok": False, "error": "Invalid credentials"}
    return {"ok": True, "access_token": make_jwt(user.uuid), "premium": user.is_premium}

@app.post("/auth/{provider}/login")
def oauth_login(provider: str, payload: OAuthLoginIn, db: Session = Depends(get_db)):
    """
    Mock endpoint for OAuth login (Google, Apple, Github).
    In a real scenario, the frontend sends an OAuth access token or auth code, 
    and the backend verifies it with the provider's API.
    """
    valid_providers = ["google", "apple", "github"]
    if provider not in valid_providers:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
        
    # Mocking the verification: assume the token contains the external user's ID
    # For this demo, we use the token value as the oauth_id
    external_oauth_id = payload.token
    
    # 1. Check if user with this oauth_id and provider already exists
    user = db.query(User).filter(User.oauth_provider == provider, User.oauth_id == external_oauth_id).first()
    
    # 2. If not, auto-register the user
    if not user:
        new_uuid = str(uuid.uuid4())
        user = User(
            uuid=new_uuid,
            password_hash=None, # No password for OAuth users
            oauth_provider=provider,
            oauth_id=external_oauth_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # 3. Generate internal JWT session token
    return {
        "ok": True, 
        "access_token": make_jwt(user.uuid), 
        "premium": user.is_premium,
        "uuid": user.uuid
    }

@app.post("/purchase", response_model=PurchaseOut)
async def purchase(payload: PurchaseIn, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_uuid)):
    user = db.get(User, current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Simulate payment processing...
    
    # Update MySQL
    user.is_premium = True
    db.commit()
    
    # Store purchase transaction in NoSQL (MongoDB)
    transaction = {
        "uuid": user.uuid,
        "plan": payload.plan_id,
        "status": "completed",
        "timestamp": datetime.utcnow()
    }
    await mongo_db["purchases"].insert_one(transaction)

    return PurchaseOut(success=True, message="Purchase completed! You are now Premium.", is_premium=True)

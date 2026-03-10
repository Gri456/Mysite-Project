from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import User
from .schemas import SignUpIn, LoginIn, TokenOut
from .auth import hash_password, verify_password, make_jwt

app = FastAPI(title="BitJourney API")

# Permitir o front do XAMPP (ajusta se precisares)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1"],
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

@app.post("/auth/signup", response_model=TokenOut)
def signup(payload: SignUpIn, db: Session = Depends(get_db)):
    if db.get(User, payload.uuid):
        raise HTTPException(status_code=409, detail="UUID already registered")
    db.add(User(uuid=payload.uuid, password_hash=hash_password(payload.password)))
    db.commit()
    return {"access_token": make_jwt(payload.uuid)}

@app.post("/auth/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.get(User, payload.uuid)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": make_jwt(user.uuid)}

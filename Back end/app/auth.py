import os
import time
import jwt
from passlib.hash import bcrypt
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "secret")  # fallback se não encontrar no .env
JWT_ALG = os.getenv("JWT_ALG", "HS256")

# Função para gerar hash de password
def hash_password(pw: str) -> str:
    return bcrypt.hash(pw)

# Função para verificar password
def verify_password(pw: str, h: str) -> bool:
    return bcrypt.verify(pw, h)

# Função para criar JWT
def make_jwt(sub: str, minutes=60) -> str:
    payload = {
        "sub": sub,
        "exp": int(time.time()) + minutes * 60
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

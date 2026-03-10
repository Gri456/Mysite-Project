from pydantic import BaseModel, constr
from typing import Optional

# UUID em string de 36 caracteres
UUIDStr = constr(min_length=36, max_length=36)

# Modelo para signup
class SignUpIn(BaseModel):
    uuid: UUIDStr
    password: constr(min_length=6)

# Modelo para login
class LoginIn(BaseModel):
    uuid: UUIDStr
    password: str

# Modelo para login OAuth
class OAuthLoginIn(BaseModel):
    token: str # OAuth token directly provided by Google/Apple/GitHub SDK in frontend

# Modelo para resposta com token JWT
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Modelo para compras
class PurchaseIn(BaseModel):
    plan_id: str

class PurchaseOut(BaseModel):
    success: bool
    message: str
    is_premium: Optional[bool] = None

from pydantic import BaseModel, constr

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

# Modelo para resposta com token JWT
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

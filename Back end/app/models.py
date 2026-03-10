from sqlalchemy import Column, String, Boolean, TIMESTAMP, text
from .db import Base

class User(Base):
    __tablename__ = "users"

    uuid = Column(String(36), primary_key=True, index=True)
    password_hash = Column(String(255), nullable=True) # Pode ser nulo se o login for via OAuth
    oauth_provider = Column(String(50), nullable=True)
    oauth_id = Column(String(255), nullable=True)
    is_premium = Column(Boolean, nullable=False, server_default=text("0"))
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

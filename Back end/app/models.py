from sqlalchemy import Column, String, Boolean, TIMESTAMP, text
from .db import Base

class User(Base):
    __tablename__ = "users"

    uuid = Column(String(36), primary_key=True, index=True)
    password_hash = Column(String(255), nullable=False)
    is_premium = Column(Boolean, nullable=False, server_default=text("0"))
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))

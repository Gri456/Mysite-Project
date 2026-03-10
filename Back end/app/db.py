import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Carrega variáveis de ambiente (.env)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  # exemplo: mysql+pymysql://root:@127.0.0.1:3306/bitjourney

# Cria engine (conexão ao MySQL)
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)

# Cria uma sessão ligada ao engine
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Base para os modelos do SQLAlchemy
Base = declarative_base()

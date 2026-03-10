import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import motor.motor_asyncio

# Carrega variáveis de ambiente (.env)
load_dotenv()

# MySQL Database settings
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_NAME = os.getenv("DB_NAME", "bitjourney")

# Construct the SQLAlchemy database URL dynamically based on env vars
DATABASE_URL = os.getenv("DATABASE_URL", f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:3306/{DB_NAME}")

# Cria engine (conexão ao MySQL)
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)

# Cria uma sessão ligada ao engine
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Base para os modelos do SQLAlchemy
Base = declarative_base()

# MongoDB settings
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
mongo_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
mongo_db = mongo_client["bitjourney_nosql"]

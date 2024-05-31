# config/database.py
from sqlalchemy import create_engine

DATABASE_URI = 'mysql+pymysql://root:@localhost/secure_transaction'  # Update with your actual database URI
engine = create_engine(DATABASE_URI)

# import sqlite3
# import os
# DB_PATH = "data/users.db"

# def get_db():
#     conn = sqlite3.connect(DB_PATH)
#     conn.row_factory = sqlite3.Row
#     return conn

# DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "app.db")

# def init_db():
#     conn = get_db()
#     cur = conn.cursor()

#     # Users table
#     cur.execute("""
#     CREATE TABLE IF NOT EXISTS users (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         username TEXT NOT NULL,
#         device TEXT NOT NULL,
#         min_trust REAL DEFAULT 0.65,
#         proximity_limit REAL DEFAULT 3.0
#     )
#     """)

#     # Decisions table
#     cur.execute("""
#     CREATE TABLE IF NOT EXISTS decisions (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         user_id INTEGER,
#         timestamp TEXT,
#         trust REAL,
#         result TEXT,
#         note TEXT,
#         FOREIGN KEY(user_id) REFERENCES users(id)
#     )
#     """)

#     conn.commit()
#     conn.close()
  
import psycopg2 # pyright: ignore[reportMissingModuleSource]
#from psycopg2.extras import RealDictCursor # type: ignore

def get_db():
    try:
       conn = psycopg2.connect(
       dbname="auth_system",
       user="postgres",
       password="1234",
       host="localhost",
       port="5432"
)
       return conn
    except Exception as e:
        print("❌ Database connection failed:", e)
        return None






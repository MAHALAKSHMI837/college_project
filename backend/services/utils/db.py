import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    """
    Get a database connection using psycopg2
    """
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "auth_system"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "yourpassword"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        return conn
    except Exception as e:
        print("❌ DB Connection Error:", e)
        return None

def test_connection():
    """
    Test the database connection
    """
    conn = get_db()
    if conn:
        print("✅ Database connection successful")
        conn.close()
        return True
    else:
        print("❌ Database connection failed")
        return False

# Test connection when module is run directly
if __name__ == "__main__":
    test_connection()
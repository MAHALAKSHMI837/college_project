import psycopg2 
from backend.utils.db import get_db #type: ignore
# Connect to PostgreSQL
def get_db():
    return psycopg2.connect(
        dbname="auth_system",     # replace with your DB name
        user="postgres",          # your PostgreSQL username
        password="1234", # your PostgreSQL password
        host="localhost",         # or server IP
        port="5432"               # default PostgreSQL port
    )

# Create user function
def create_user(username, device):
    conn = None
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, device) VALUES (%s, %s)",
            (username, device)
        )
        conn.commit()
        cur.close()
    except Exception as e:
        raise Exception(f"DB Error: {str(e)}")
    finally:
        if conn:
            conn.close()

def get_user_by_id(user_id):
    """
    Get user by ID
    
    Args:
        user_id (int): The user ID to search for
    
    Returns:
        dict: User information or None if not found
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return None
    
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, username, device, created_at FROM users WHERE id = %s",
            (user_id,)
        )
        user = cur.fetchone()
        if user:
            return {
                "id": user[0],
                "username": user[1],
                "device": user[2],
                "created_at": user[3]
            }
        return None
    except Exception as e:
        print(f"❌ Error retrieving user: {e}")
        return None
    finally:
        cur.close()
        conn.close()
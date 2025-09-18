import psycopg2 

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

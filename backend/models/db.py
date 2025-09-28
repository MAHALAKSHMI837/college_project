import psycopg2

def get_db():
    try:
        conn = psycopg2.connect(
            dbname="auth_system",     # your DB name
            user="postgres",          # your PostgreSQL username
            password="1234",          # your PostgreSQL password
            host="localhost",
            port="5432"
        )
        return conn
    except Exception as e:
        print("❌ DB Connection Error:", e)
        return None

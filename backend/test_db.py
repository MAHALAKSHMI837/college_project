import psycopg2

def test_connection():
    try:
        conn = psycopg2.connect(
            dbname="auth_system",
            user="postgres", 
            password="1234",  # Change to your actual password
            host="localhost",
            port="5432"
        )
        print("✅ Database connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
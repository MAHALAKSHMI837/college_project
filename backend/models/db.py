import psycopg2
from config import Config

def get_db():
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT
        )
        return conn
    except Exception as e:
        print("❌ DB Connection Error:", e)
        return None

def init_database():
    """Initialize the PostgreSQL database with proper data"""
    conn = get_db()
    if not conn:
        print("❌ Cannot initialize database - no connection")
        return
    
    try:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                device VARCHAR(100) DEFAULT 'Unknown Device',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create decisions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS decisions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                trust_score DOUBLE PRECISION NOT NULL,
                result VARCHAR(20) NOT NULL,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Check if sample user exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'sample'")
        result = cursor.fetchone()
        user_exists = result[0] > 0 if result else False
        
        if not user_exists:
            cursor.execute('''
                INSERT INTO users (username, password_hash, email, device) 
                VALUES (%s, %s, %s, %s)
            ''', ('sample', 'password123', 'sample@example.com', 'Web Browser'))
            print("✅ Sample user created: sample / password123")
        
        conn.commit()
        print("✅ Database initialized successfully")
        
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        conn.rollback()
    finally:
        conn.close()

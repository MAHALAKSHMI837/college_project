import bcrypt
import psycopg2

def reset_passwords():
    """Reset all user passwords to 'admin123'"""
    
    # Database connection
    conn = psycopg2.connect(
        dbname="auth_system",
        user="postgres",
        password=1234,  # Change to your actual password
        host="localhost",
        port="5432"
    )
    
    cur = conn.cursor()
    
    try:
        # Hash for 'admin123'
        password = "admin123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed_str = hashed_password.decode('utf-8')
        
        print(f"🔑 New password hash for 'admin123': {hashed_str}")
        
        # Update all users with the new password hash
        cur.execute("UPDATE users SET password_hash = %s", (hashed_str,))
        conn.commit()
        
        # Verify the update
        cur.execute("SELECT username, password_hash FROM users")
        users = cur.fetchall()
        
        print("✅ Updated users:")
        for username, pwd_hash in users:
            # Test the password
            is_valid = bcrypt.checkpw(password.encode('utf-8'), pwd_hash.encode('utf-8'))
            status = "✅" if is_valid else "❌"
            print(f"  {status} {username}: {pwd_hash[:30]}...")
            
        print(f"\n🎯 All passwords reset to: {password}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    reset_passwords()
# from backend.utils.db import get_db

# def test_db():
#     conn = get_db()
#     if conn:
#         print("✅ Database connection successful!")
        
#         # Test a simple query
#         cur = conn.cursor()
#         try:
#             cur.execute("SELECT version()")
#             version = cur.fetchone()
#             print(f"✅ PostgreSQL version: {version[0]}") #ignore
            
#             # Test if tables exist
#             cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
#             tables = cur.fetchall()
#             print("✅ Available tables:", [table[0] for table in tables])
            
#         except Exception as e:
#             print(f"❌ Query error: {e}")
#         finally:
#             cur.close()
#             conn.close()
#     else:
#         print("❌ Database connection failed!")

# if __name__ == "__main__":
#     test_db()
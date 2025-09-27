
# # from flask import Blueprint, request, jsonify
# # from backend.utils.db import get_db
# # from backend.models.decision_model import save_decision
# # import bcrypt
# # import jwt
# # import datetime
# # import os
# # from dotenv import load_dotenv

# # # Load environment variables from .env file
# # load_dotenv()

# # auth_bp = Blueprint("auth", __name__)

# # # Get JWT secret from environment variable with a fallback for development
# # JWT_SECRET = os.getenv("JWT_SECRET")
# # if not JWT_SECRET:
# #     # Fallback for development - generate a random one if not set
# #     import secrets
# #     JWT_SECRET = secrets.token_urlsafe(32)
# #     print(f"⚠️  JWT_SECRET not set. Using generated secret: {JWT_SECRET}")
# #     print("⚠️  For production, set JWT_SECRET in your .env file")

# # @auth_bp.route("/login", methods=["POST"])
# # def login():
# #     data = request.get_json()
# #     username = data.get("username") if data else None
# #     password = data.get("password") if data else None
    
# #     if not username or not password:
# #         return jsonify({"error": "Username and password required"}), 400
    
# #     conn = get_db()
# #     if not conn: 
# #         return jsonify({"error": "Database error"}), 500
    
# #     try:
# #         cur = conn.cursor()
# #         cur.execute(
# #             "SELECT id, password_hash FROM users WHERE username = %s", 
# #             (username,)
# #         )
# #         user = cur.fetchone()
        
# #         if not user or not bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
# #             return jsonify({"error": "Invalid credentials"}), 401
        
# #         # Generate JWT token
# #         token = jwt.encode({
# #             'user_id': user[0],
# #             'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
# #         }, JWT_SECRET, algorithm='HS256')
        
# #         return jsonify({
# #             "token": token, 
# #             "user_id": user[0],
# #             "username": username
# #         }), 200
        
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500
# #     finally:
# #         cur.close()
# #         conn.close()

# # @auth_bp.route("/decision", methods=["POST"])
# # def make_decision():
# #     """
# #     Endpoint to save authentication decisions
# #     """
# #     try:
# #         # Check if request has JSON data
# #         if not request.is_json:
# #             return jsonify({"error": "Request must be JSON"}), 400
            
# #         data = request.get_json()
        
# #         # Check if data is None (empty JSON)
# #         if data is None:
# #             return jsonify({"error": "No JSON data received"}), 400
        
# #         # Safely get values with defaults
# #         user_id = data.get("user_id")
# #         trust = data.get("trust")
# #         result = data.get("result")
# #         note = data.get("note", "")
        
# #         print(f"📝 Received decision: user_id={user_id}, trust={trust}, result={result}")
        
# #         # Validate required fields
# #         if user_id is None or trust is None:
# #             return jsonify({"error": "User ID and trust score are required"}), 400
        
# #         # Convert to appropriate types
# #         try:
# #             user_id = int(user_id)
# #             trust = float(trust)
# #         except (ValueError, TypeError):
# #             return jsonify({"error": "Invalid user_id or trust format"}), 400
        
# #         # If result is not provided, determine it based on trust score
# #         if not result:
# #             if trust >= 0.7:
# #                 result = "ALLOW"
# #                 note = "Normal behavior pattern"
# #             elif trust >= 0.4:
# #                 result = "CHALLENGE"
# #                 note = "Additional verification required"
# #             else:
# #                 result = "BLOCK"
# #                 note = "Suspicious activity detected"
        
# #         # Save to database
# #         success = save_decision(user_id, trust, result, note)
        
# #         if success:
# #             return jsonify({
# #                 "success": True,
# #                 "result": result,
# #                 "note": note,
# #                 "trust": trust,
# #                 "user_id": user_id
# #             }), 200
# #         else:
# #             return jsonify({"error": "Failed to save decision to database"}), 500
            
# #     except Exception as e:
# #         print(f"❌ Error in decision endpoint: {e}")
# #         return jsonify({"error": "Internal server error"}), 500

# # @auth_bp.route("/test", methods=["GET"])
# # def test_auth():
# #     """Test endpoint to verify auth blueprint is working"""
# #     return jsonify({
# #         "message": "Auth blueprint is working!",
# #         "jwt_secret_set": bool(JWT_SECRET),
# #         "jwt_secret_length": len(JWT_SECRET) if JWT_SECRET else 0
# #     })

# from flask import Blueprint, request, jsonify
# from backend.services.utils.db import get_db
# from backend.models.decision_model import save_decision
# import bcrypt
# import jwt
# import datetime
# import os
# from dotenv import load_dotenv

# load_dotenv()

# auth_bp = Blueprint("auth", __name__)
# JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret_key_change_me")

# @auth_bp.route("/register", methods=["POST"])
# def register():
#     """Register a new user"""
#     try:
#         if not request.is_json:
#             return jsonify({"error": "Request must be JSON"}), 400
            
#         data = request.get_json()
#         if data is None:
#             return jsonify({"error": "No JSON data received"}), 400
        
#         username = data.get("username")
#         password = data.get("password")
#         email = data.get("email")
#         device = data.get("device", "Unknown Device")
        
#         if not username or not password:
#             return jsonify({"error": "Username and password are required"}), 400
        
#         conn = get_db()
#         if not conn: 
#             return jsonify({"error": "Database error"}), 500
        
#         cur = conn.cursor()
#         try:
#             # Check if username already exists
#             cur.execute("SELECT id FROM users WHERE username = %s", (username,))
#             if cur.fetchone():
#                 return jsonify({"error": "Username already exists"}), 400
            
#             # Hash password
#             hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
#             # Create user
#             cur.execute(
#                 "INSERT INTO users (username, password_hash, email, device) VALUES (%s, %s, %s, %s) RETURNING id",
#                 (username, hashed_password.decode('utf-8'), email, device)
#             )
#             user_id = cur.fetchone()[0] #type: ignore
#             conn.commit()
            
#             # Generate JWT token
#             token = jwt.encode({
#                 'user_id': user_id,
#                 'username': username,
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, JWT_SECRET, algorithm='HS256')
            
#             return jsonify({
#                 "success": True,
#                 "message": "User registered successfully",
#                 "token": token,
#                 "user_id": user_id,
#                 "username": username
#             }), 201
            
#         except Exception as e:
#             conn.rollback()
#             return jsonify({"error": str(e)}), 500
#         finally:
#             cur.close()
#             conn.close()
            
#     except Exception as e:
#         return jsonify({"error": "Internal server error"}), 500

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     """Login user with debug information"""
#     try:
#         if not request.is_json:
#             return jsonify({"error": "Request must be JSON"}), 400
            
#         data = request.get_json()
#         if data is None:
#             return jsonify({"error": "No JSON data received"}), 400
        
#         username = data.get("username")
#         password = data.get("password")
#         device = data.get("device", "Unknown Device")
        
#         print(f"🔐 Login attempt: username='{username}'")
        
#         if not username or not password:
#             return jsonify({"error": "Username and password are required"}), 400
        
#         conn = get_db()
#         if not conn: 
#             return jsonify({"error": "Database error"}), 500
        
#         cur = conn.cursor()
#         try:
#             # Get user from database
#             cur.execute(
#                 "SELECT id, username, password_hash, device FROM users WHERE username = %s", 
#                 (username,)
#             )
#             user = cur.fetchone()
            
#             print(f"📊 User query result: {user}")
            
#             if not user:
#                 print("❌ User not found")
#                 return jsonify({"error": "Invalid credentials"}), 401
            
#             # Debug password verification
#             print(f"🔑 Stored hash: {user[2]}")
#             print(f"🔑 Password provided: {password}")
            
#             # Check if password_hash is NULL or empty
#             if not user[2]:
#                 print("❌ Password hash is NULL or empty")
#                 return jsonify({"error": "Invalid credentials"}), 401
            
#             # Try bcrypt check
#             try:
#                 password_valid = bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8'))
#                 print(f"✅ Bcrypt check result: {password_valid}")
#             except Exception as bcrypt_error:
#                 print(f"❌ Bcrypt error: {bcrypt_error}")
#                 # Fallback: simple string comparison for testing
#                 password_valid = (user[2] == password)
#                 print(f"🔄 Fallback check result: {password_valid}")
            
#             if not password_valid:
#                 print("❌ Password invalid")
#                 return jsonify({"error": "Invalid credentials"}), 401            
            
#             # Update device info
#             cur.execute(
#                 "UPDATE users SET device = %s WHERE id = %s",
#                 (device, user[0])
#             )
#             conn.commit()
            
#             # Generate JWT token
#             token = jwt.encode({
#                 'user_id': user[0],
#                 'username': user[1],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, JWT_SECRET, algorithm='HS256')
            
#             print(f"✅ Login successful for user: {user[1]}")
            
#             return jsonify({
#                 "success": True,
#                 "message": "Login successful",
#                 "token": token,
#                 "user_id": user[0],
#                 "username": user[1],
#                 "device": device
#             }), 200
            
#         except Exception as e:
#             print(f"❌ Database error: {e}")
#             return jsonify({"error": str(e)}), 500
#         finally:
#             cur.close()
#             conn.close()
            
#     except Exception as e:
#         print(f"❌ General error: {e}")
#         return jsonify({"error": "Internal server error"}), 500

# @auth_bp.route("/decision", methods=["POST"])
# def make_decision():
#     """Save authentication decision for logged-in user"""
#     try:
#         if not request.is_json:
#             return jsonify({"error": "Request must be JSON"}), 400
            
#         data = request.get_json()
#         if data is None:
#             return jsonify({"error": "No JSON data received"}), 400
        
#         # Get user_id from token or from request
#         user_id = data.get("user_id")
#         trust = data.get("trust")
#         result = data.get("result")
#         note = data.get("note", "")
        
#         # Try to get user_id from JWT token if not provided
#         if not user_id:
#             auth_header = request.headers.get('Authorization')
#             if auth_header and auth_header.startswith('Bearer '):
#                 try:
#                     token = auth_header.split(" ")[1]
#                     decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
#                     user_id = decoded.get('user_id')
#                 except:
#                     pass
        
#         if user_id is None or trust is None:
#             return jsonify({"error": "User ID and trust score are required"}), 400
        
#         # Convert to appropriate types
#         try:
#             user_id = int(user_id)
#             trust = float(trust)
#         except (ValueError, TypeError):
#             return jsonify({"error": "Invalid user_id or trust format"}), 400
        
#         # If result is not provided, determine it based on trust score
#         if not result:
#             if trust >= 0.7:
#                 result = "ALLOW"
#                 note = "Normal behavior pattern"
#             elif trust >= 0.4:
#                 result = "CHALLENGE"
#                 note = "Additional verification required"
#             else:
#                 result = "BLOCK"
#                 note = "Suspicious activity detected"
        
#         # Save to database
#         success = save_decision(user_id, trust, result, note)
        
#         if success:
#             return jsonify({
#                 "success": True,
#                 "result": result,
#                 "note": note,
#                 "trust": trust,
#                 "user_id": user_id
#             }), 200
#         else:
#             return jsonify({"error": "Failed to save decision to database"}), 500
            
#     except Exception as e:
#         print(f"❌ Error in decision endpoint: {e}")
#         return jsonify({"error": "Internal server error"}), 500
    
# @auth_bp.route("/debug-users", methods=["GET"])
# def debug_users():
#     """Debug endpoint to see all users and their password hashes"""
#     conn = get_db()
#     if not conn: 
#         return jsonify({"error": "Database error"}), 500
    
#     cur = conn.cursor()
#     try:
#         cur.execute("SELECT id, username, password_hash, device, LENGTH(password_hash) as hash_length FROM users")
#         users = []
#         for row in cur.fetchall():
#             users.append({
#                 "id": row[0],
#                 "username": row[1],
#                 "password_hash": row[2],
#                 "hash_length": row[4],
#                 "device": row[3]
#             })
#         return jsonify(users), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         cur.close()
#         conn.close()

# @auth_bp.route("/profile", methods=["GET"])
# def get_profile():
#     """Get user profile using JWT token"""
#     try:
#         auth_header = request.headers.get('Authorization')
#         if not auth_header or not auth_header.startswith('Bearer '):
#             return jsonify({"error": "Authorization token required"}), 401
        
#         token = auth_header.split(" ")[1]
#         decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
#         user_id = decoded.get('user_id')
        
#         conn = get_db()
#         if not conn: 
#             return jsonify({"error": "Database error"}), 500
        
#         cur = conn.cursor()
#         try:
#             cur.execute(
#                 "SELECT id, username, device, email, created_at FROM users WHERE id = %s",
#                 (user_id,)
#             )
#             user = cur.fetchone()
            
#             if not user:
#                 return jsonify({"error": "User not found"}), 404
            
#             return jsonify({
#                 "user_id": user[0],
#                 "username": user[1],
#                 "device": user[2],
#                 "email": user[3],
#                 "created_at": user[4].isoformat() if user[4] else None
#             }), 200
            
#         except Exception as e:
#             return jsonify({"error": str(e)}), 500
#         finally:
#             cur.close()
#             conn.close()
            
#     except jwt.ExpiredSignatureError:
#         return jsonify({"error": "Token has expired"}), 401
#     except jwt.InvalidTokenError:
#         return jsonify({"error": "Invalid token"}), 401
#     except Exception as e:
#         return jsonify({"error": "Internal server error"}), 500

# @auth_bp.route("/users", methods=["GET"])
# def get_all_users():
#     """Get all users (admin function)"""
#     conn = get_db()
#     if not conn: 
#         return jsonify({"error": "Database error"}), 500
    
#     cur = conn.cursor()
#     try:
#         cur.execute("SELECT id, username, device, email, created_at FROM users ORDER BY created_at DESC")
#         users = []
#         for row in cur.fetchall():
#             users.append({
#                 "id": row[0],
#                 "username": row[1],
#                 "device": row[2],
#                 "email": row[3],
#                 "created_at": row[4].isoformat() if row[4] else None
#             })
#         return jsonify(users), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         cur.close()
#         conn.close()

from flask import Blueprint, request, jsonify
from backend.services.utils.db import get_db
from backend.models.decision_model import save_decision
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint("auth", __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "your_super_secure_secret_key_here_make_it_very_long_and_random")

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        if data is None:
            return jsonify({"error": "No JSON data received"}), 400
        
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        device = data.get("device", "Unknown Device")
        
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        conn = get_db()
        if not conn: 
            return jsonify({"error": "Database error"}), 500
        
        cur = conn.cursor()
        try:
            # Check if username already exists
            cur.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                return jsonify({"error": "Username already exists"}), 400
            
            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            # Create user
            cur.execute(
                "INSERT INTO users (username, password_hash, email, device) VALUES (%s, %s, %s, %s) RETURNING id",
                (username, hashed_password.decode('utf-8'), email, device)
            )
            user_id = cur.fetchone()[0] #type: ignore
            conn.commit()
            
            # Generate JWT token
            token = jwt.encode({
                'user_id': user_id,
                'username': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                "success": True,
                "message": "User registered successfully",
                "token": token,
                "user_id": user_id,
                "username": username
            }), 201
            
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close()
            conn.close()
            
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     """Login user with debug information"""
#     try:
#         if not request.is_json:
#             return jsonify({"error": "Request must be JSON"}), 400
            
#         data = request.get_json()
#         if data is None:
#             return jsonify({"error": "No JSON data received"}), 400
        
#         username = data.get("username")
#         password = data.get("password")
#         device = data.get("device", "Unknown Device")
        
#         print(f"🔐 Login attempt: username='{username}'")
        
#         if not username or not password:
#             return jsonify({"error": "Username and password are required"}), 400
        
#         conn = get_db()
#         if not conn: 
#             return jsonify({"error": "Database error"}), 500
        
#         cur = conn.cursor()
#         try:
#             # Get user from database
#             cur.execute(
#                 "SELECT id, username, password_hash, device FROM users WHERE username = %s", 
#                 (username,)
#             )
#             user = cur.fetchone()
            
#             print(f"📊 User query result: {user}")
            
#             if not user:
#                 print("❌ User not found")
#                 return jsonify({"error": "Invalid credentials"}), 401
            
#             # Debug password verification
#             print(f"🔑 Stored hash: {user[2]}")
#             print(f"🔑 Password provided: {password}")
            
#             # Check if password_hash is NULL or empty
#             if not user[2]:
#                 print("❌ Password hash is NULL or empty")
#                 return jsonify({"error": "Invalid credentials"}), 401
            
#             # Try bcrypt check
#             try:
#                 password_valid = bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8'))
#                 print(f"✅ Bcrypt check result: {password_valid}")
#             except Exception as bcrypt_error:
#                 print(f"❌ Bcrypt error: {bcrypt_error}")
#                 # Fallback: simple string comparison for testing
#                 password_valid = (user[2] == password)
#                 print(f"🔄 Fallback check result: {password_valid}")
            
#             if not password_valid:
#                 print("❌ Password invalid")
#                 return jsonify({"error": "Invalid credentials"}), 401            
            
#             # Update device info
#             cur.execute(
#                 "UPDATE users SET device = %s WHERE id = %s",
#                 (device, user[0])
#             )
#             conn.commit()
            
#             # Generate JWT token
#             token = jwt.encode({
#                 'user_id': user[0],
#                 'username': user[1],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, JWT_SECRET, algorithm='HS256')
            
#             print(f"✅ Login successful for user: {user[1]}")
            
#             return jsonify({
#                 "success": True,
#                 "message": "Login successful",
#                 "token": token,
#                 "user_id": user[0],
#                 "username": user[1],
#                 "device": device
#             }), 200
            
#         except Exception as e:
#             print(f"❌ Database error: {e}")
#             return jsonify({"error": str(e)}), 500
#         finally:
#             cur.close()
#             conn.close()
            
#     except Exception as e:
#         print(f"❌ General error: {e}")
#         return jsonify({"error": "Internal server error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        username = data.get("username", "unknown")
        password = data.get("password", "")
        
        print(f"🔐 Login attempt for user: {username}")
        
        # Simple authentication for testing
        if username == "sample" and password == "password":
            token = jwt.encode({
                'user_id': 1,
                'username': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, 'secret-key', algorithm='HS256')
            
            return jsonify({
                "success": True,
                "message": "Login successful",
                "token": token,
                "user_id": 1,
                "username": username
            })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid credentials. Use username: 'sample', password: 'password'"
            }), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# @auth_bp.route("/test", methods=["GET"])
# def test_auth():
#     """Test endpoint to verify auth router is working"""
#     return jsonify({"message": "Auth router is working!", "status": "success"})

@auth_bp.route("/health", methods=["GET"])
def auth_health():
    """Health check for auth routes"""
    return jsonify({"status": "healthy", "service": "auth"})

@auth_bp.route("/test")
def test_auth():
    return jsonify({"message": "Auth blueprint is working!"})

@auth_bp.route("/login", methods=["POST"])
def login():
    return jsonify({"message": "Login endpoint", "status": "success"})

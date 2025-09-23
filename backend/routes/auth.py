# from flask import Blueprint, request, jsonify

# auth_bp = Blueprint("auth", __name__)

# # For demo: hardcoded admin user
# ADMIN_USERNAME = "admin"
# ADMIN_PASSWORD = "admin123"

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     if not data or "username" not in data or "password" not in data:
#         return jsonify({"error": "Missing credentials"}), 400

#     if data["username"] == ADMIN_USERNAME and data["password"] == ADMIN_PASSWORD:
#         return jsonify({"status": "success", "role": "admin"})
#     else:
#         return jsonify({"error": "Invalid username or password"}), 401
# # 

from flask import Blueprint, request, jsonify
from backend.utils.db import get_db
from backend.models.decision_model import save_decision
import bcrypt
import jwt
import datetime
import os

auth_bp = Blueprint("auth", __name__)
JWT_SECRET = "your_secret_key_change_in_production"  # For development only

# Login endpoint
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    
    conn = get_db()
    if not conn: return jsonify({"error": "Database error"}), 500
    
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, password_hash FROM users WHERE username = %s", 
            (username,)
        )
        user = cur.fetchone()
        
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            "token": token, 
            "user_id": user[0],
            "username": username
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Decision endpoint
@auth_bp.route("/decision", methods=["POST"])
def make_decision():
    """
    Endpoint to save authentication decisions
    """
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        
        # Check if data is None (empty JSON)
        if data is None:
            return jsonify({"error": "No JSON data received"}), 400
        
        # Safely get values with defaults
        user_id = data.get("user_id")
        trust = data.get("trust")
        result = data.get("result")
        note = data.get("note", "")
        
        print(f"📝 Received decision: user_id={user_id}, trust={trust}, result={result}")
        
        # Validate required fields
        if user_id is None or trust is None:
            return jsonify({"error": "User ID and trust score are required"}), 400
        
        # Convert to appropriate types
        try:
            user_id = int(user_id)
            trust = float(trust)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid user_id or trust format"}), 400
        
        # If result is not provided, determine it based on trust score
        if not result:
            if trust >= 0.7:
                result = "ALLOW"
                note = "Normal behavior pattern"
            elif trust >= 0.4:
                result = "CHALLENGE"
                note = "Additional verification required"
            else:
                result = "BLOCK"
                note = "Suspicious activity detected"
        
        # Save to database
        success = save_decision(user_id, trust, result, note)
        
        if success:
            return jsonify({
                "success": True,
                "result": result,
                "note": note,
                "trust": trust,
                "user_id": user_id
            }), 200
        else:
            return jsonify({"error": "Failed to save decision to database"}), 500
            
    except Exception as e:
        print(f"❌ Error in decision endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


from flask import Blueprint, request, jsonify
from backend.utils.db import get_db
from backend.models.decision_model import save_decision
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

auth_bp = Blueprint("auth", __name__)

# Get JWT secret from environment variable with a fallback for development
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    # Fallback for development - generate a random one if not set
    import secrets
    JWT_SECRET = secrets.token_urlsafe(32)
    print(f"⚠️  JWT_SECRET not set. Using generated secret: {JWT_SECRET}")
    print("⚠️  For production, set JWT_SECRET in your .env file")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username") if data else None
    password = data.get("password") if data else None
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    
    conn = get_db()
    if not conn: 
        return jsonify({"error": "Database error"}), 500
    
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

@auth_bp.route("/test", methods=["GET"])
def test_auth():
    """Test endpoint to verify auth blueprint is working"""
    return jsonify({
        "message": "Auth blueprint is working!",
        "jwt_secret_set": bool(JWT_SECRET),
        "jwt_secret_length": len(JWT_SECRET) if JWT_SECRET else 0
    })
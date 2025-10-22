"""
Authentication routes
"""
from flask import Blueprint, request, jsonify
import jwt # type: ignore
from datetime import datetime, timezone, timedelta
from config import Config
from models.user_model import UserModel
from utils.validators import validator
from utils.helpers import response_helper
from middleware.security import rate_limit

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@rate_limit(limit=10, window=60)  # 10 attempts per minute
def login():
    """User login endpoint"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not validator.validate_username(username):
            return jsonify(response_helper.error_response("Invalid username format")), 400
        
        if not validator.validate_password(password):
            return jsonify(response_helper.error_response("Invalid password format")), 400
        
        # Verify credentials
        user = UserModel.verify_password(username, password)
        if not user:
            return jsonify(response_helper.error_response("Invalid credentials")), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        return jsonify(response_helper.success_response({
            'token': token,
            'user_id': user['id'],
            'username': user['username'],
            'device': user['device']
        }, "Login successful"))
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Login failed: {str(e)}")), 500

@auth_bp.route('/admin-login', methods=['POST'])
@rate_limit(limit=5, window=60)  # 5 admin attempts per minute
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Simple admin credentials check
        if username == 'admin' and password == 'admin123':
            # Generate JWT token for admin
            token = jwt.encode({
                'user_id': 999,  # Special admin ID
                'username': 'admin',
                'is_admin': True,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }, Config.SECRET_KEY, algorithm='HS256')
            
            return jsonify(response_helper.success_response({
                'token': token,
                'user_id': 999,
                'username': 'admin',
                'is_admin': True
            }, "Admin login successful"))
        else:
            return jsonify(response_helper.error_response("Invalid admin credentials")), 401
            
    except Exception as e:
        return jsonify(response_helper.error_response(f"Admin login failed: {str(e)}")), 500

@auth_bp.route('/register', methods=['POST'])
@rate_limit(limit=5, window=300)  # 5 registrations per 5 minutes
def register():
    """User registration endpoint"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        email = data.get('email', '').strip()
        
        # Validate input
        if not validator.validate_username(username):
            return jsonify(response_helper.error_response("Invalid username format")), 400
        
        if not validator.validate_password(password):
            return jsonify(response_helper.error_response("Password must be at least 6 characters")), 400
        
        if email and not validator.validate_email(email):
            return jsonify(response_helper.error_response("Invalid email format")), 400
        
        # Check if user exists
        existing_user = UserModel.get_user_by_username(username)
        if existing_user:
            return jsonify(response_helper.error_response("Username already exists")), 400
        
        # Create user
        user_id = UserModel.create_user(username, password, email)
        if not user_id:
            return jsonify(response_helper.error_response("Failed to create user")), 500
        
        # Generate token
        token = jwt.encode({
            'user_id': user_id,
            'username': username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        return jsonify(response_helper.success_response({
            'token': token,
            'user_id': user_id,
            'username': username
        }, "Registration successful")), 201
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Registration failed: {str(e)}")), 500
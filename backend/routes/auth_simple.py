"""
Simple auth routes without complex dependencies
"""
from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timezone, timedelta

auth_simple_bp = Blueprint('auth_simple', __name__)

@auth_simple_bp.route('/admin-login', methods=['POST'])
def admin_login_simple():
    """Simple admin login without middleware"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Admin login attempt: {username}")
        
        if username == 'admin' and password == 'admin123':
            token = jwt.encode({
                'user_id': 999,
                'username': 'admin',
                'is_admin': True,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }, 'secret-key', algorithm='HS256')
            
            return jsonify({
                'success': True,
                'message': 'Admin login successful',
                'data': {
                    'token': token,
                    'user_id': 999,
                    'username': 'admin',
                    'is_admin': True
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid admin credentials'
            }), 401
            
    except Exception as e:
        print(f"Admin login error: {e}")
        return jsonify({
            'success': False,
            'error': f'Admin login failed: {str(e)}'
        }), 500

@auth_simple_bp.route('/login', methods=['POST'])
def login_simple():
    """Simple user login"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if username == 'sample' and password == 'password123':
            token = jwt.encode({
                'user_id': 1,
                'username': 'sample',
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }, 'secret-key', algorithm='HS256')
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'token': token,
                    'user_id': 1,
                    'username': 'sample'
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500
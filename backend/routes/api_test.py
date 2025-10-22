"""
API Test Routes - Test all endpoints
"""
from flask import Blueprint, jsonify

test_bp = Blueprint('test', __name__)

@test_bp.route('/auth', methods=['GET'])
def test_auth_routes():
    """Test authentication routes"""
    return jsonify({
        'auth_routes': [
            'POST /api/auth/login',
            'POST /api/auth/admin-login', 
            'POST /api/auth/register'
        ],
        'test_credentials': {
            'user': {'username': 'sample', 'password': 'password123'},
            'admin': {'username': 'admin', 'password': 'admin123'}
        }
    })

@test_bp.route('/user', methods=['GET'])
def test_user_routes():
    """Test user routes"""
    return jsonify({
        'user_routes': [
            'GET /api/user/profile (requires auth)',
            'GET /api/user/decisions (requires auth)',
            'GET /api/user/decisions/<user_id> (requires auth)'
        ],
        'note': 'All user routes require Authorization header'
    })

@test_bp.route('/admin', methods=['GET'])
def test_admin_routes():
    """Test admin routes"""
    return jsonify({
        'admin_routes': [
            'GET /api/admin/users',
            'GET /api/admin/decisions',
            'GET /api/admin/stats'
        ],
        'note': 'Admin routes are public for demo purposes'
    })

@test_bp.route('/trust', methods=['GET'])
def test_trust_routes():
    """Test trust routes"""
    return jsonify({
        'trust_routes': [
            'POST /api/trust/calculate',
            'GET /api/trust/history/<user_id> (requires auth)'
        ],
        'sample_request': {
            'url': '/api/trust/calculate',
            'body': {
                'user_id': 1,
                'behavioral_data': {
                    'wifi_rssi': [-45, -46, -47],
                    'audio_entropy': 0.5,
                    'watch_proximity': 0.8
                }
            }
        }
    })

@test_bp.route('/all', methods=['GET'])
def test_all_routes():
    """List all available routes"""
    return jsonify({
        'base_url': 'http://127.0.0.1:5000',
        'routes': {
            'authentication': [
                'POST /api/auth/login',
                'POST /api/auth/admin-login',
                'POST /api/auth/register'
            ],
            'user': [
                'GET /api/user/profile',
                'GET /api/user/decisions',
                'GET /api/user/decisions/<user_id>'
            ],
            'admin': [
                'GET /api/admin/users',
                'GET /api/admin/decisions',
                'GET /api/admin/stats'
            ],
            'trust': [
                'POST /api/trust/calculate',
                'GET /api/trust/history/<user_id>'
            ],
            'debug': [
                'POST /api/debug/create-test-data',
                'GET /api/debug/stats'
            ],
            'frontend': [
                'GET / (User Dashboard)',
                'GET /login.html (User Login)',
                'GET /admin (Admin Dashboard)',
                'GET /admin-login.html (Admin Login)'
            ]
        },
        'test_endpoints': [
            'GET /api/test/auth',
            'GET /api/test/user', 
            'GET /api/test/admin',
            'GET /api/test/trust',
            'GET /api/test/all'
        ]
    })
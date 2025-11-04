import os
import sys
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

app = Flask(__name__)
CORS(app)

from config import Config
app.config.from_object(Config)

# Import database manager and initialize
from utils.database import db_manager
from models.db import init_database

print("🔧 Starting Continuous 2FA Authentication System...")

# Initialize database
init_database()

# Import route modules with error handling
try:
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    print("✅ Auth routes registered")
except Exception as e:
    print(f"❌ Failed to register auth routes: {e}")
    try:
        from routes.auth_simple import auth_simple_bp
        app.register_blueprint(auth_simple_bp, url_prefix='/api/auth')
        print("✅ Simple auth routes registered as fallback")
    except Exception as e2:
        print(f"❌ Failed to register simple auth routes: {e2}")

try:
    from routes.trust_routes import trust_bp
    app.register_blueprint(trust_bp, url_prefix='/api/trust')
    print("✅ Trust routes registered")
except Exception as e:
    print(f"❌ Failed to register trust routes: {e}")

try:
    from routes.admin_routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    print("✅ Admin routes registered")
except Exception as e:
    print(f"❌ Failed to register admin routes: {e}")

try:
    from routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')
    print("✅ User routes registered")
except Exception as e:
    print(f"❌ Failed to register user routes: {e}")

try:
    from routes.debug_routes import debug_bp
    app.register_blueprint(debug_bp, url_prefix='/api/debug')
    print("✅ Debug routes registered")
except Exception as e:
    print(f"❌ Failed to register debug routes: {e}")

try:
    from routes.api_test import test_bp
    app.register_blueprint(test_bp, url_prefix='/api/test')
    print("✅ Test routes registered")
except Exception as e:
    print(f"❌ Failed to register test routes: {e}")

# Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    from datetime import datetime, timezone
    return jsonify({
        "status": "healthy", 
        "message": "Continuous 2FA System is running",
        'timestamp': datetime.now(timezone.utc).isoformat(),
        "version": "2.0.0"
    })

# Fallback admin login route
@app.route("/api/auth/admin-login", methods=["POST"])
def fallback_admin_login():
    """Fallback admin login if blueprint fails"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Admin login attempt: {username}")
        
        if username == 'admin' and password == 'admin123':
            import jwt #type: ignore
            from datetime import datetime, timezone, timedelta
            from config import Config
            
            token = jwt.encode({
                'user_id': 999,
                'username': 'admin',
                'is_admin': True,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }, Config.SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'success': True,
                'message': 'Admin login successful',
                'token': token,
                'user_id': 999,
                'username': 'admin',
                'is_admin': True
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid admin credentials'
            }), 401
            
    except Exception as e:
        print(f"Admin login error: {e}")
        return jsonify({
            'success': False,
            'message': f'Admin login failed: {str(e)}'
        }), 500

# Frontend serving
FRONTEND_DIR = os.path.join(parent_dir, "frontend")

@app.route("/")
def serve_user_dashboard():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

@app.route("/login.html")
def serve_login():
    return send_from_directory(FRONTEND_DIR, "login.html")

@app.route("/admin-login.html")
def serve_admin_login():
    return send_from_directory(FRONTEND_DIR, "admin-login.html")

@app.route("/admin")
def serve_admin_dashboard():
    # Try trading dashboard first
    trading_path = os.path.join(FRONTEND_DIR, "admin", "trading-dashboard.html")
    if os.path.exists(trading_path):
        return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "trading-dashboard.html")
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

@app.route("/admin/trading")
def serve_trading_dashboard():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "trading-dashboard.html")

@app.route("/<path:filename>")
def serve_static(filename):
    # Handle specific file mappings
    file_mappings = {
        'login.html': ('user', 'login_user.html'),
        'admin-login.html': ('', 'admin-login.html')
    }
    
    if filename in file_mappings:
        folder, actual_filename = file_mappings[filename]
        if folder:
            return send_from_directory(os.path.join(FRONTEND_DIR, folder), actual_filename)
        else:
            return send_from_directory(FRONTEND_DIR, actual_filename)
    
    # Try different directories
    possible_paths = [
        os.path.join(FRONTEND_DIR, "user", filename),
        os.path.join(FRONTEND_DIR, "admin", filename),
        os.path.join(FRONTEND_DIR, "js", filename),
        os.path.join(FRONTEND_DIR, filename)
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            directory = os.path.dirname(path)
            file_to_serve = os.path.basename(path)
            return send_from_directory(directory, file_to_serve)
    
    return jsonify({"error": "File not found", "requested": filename}), 404

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found", "path": request.path}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 CONTINUOUS 2FA AUTHENTICATION SYSTEM v2.0")
    print("="*60)
    
    print("\n🌐 APPLICATION URLs:")
    print("   📍 User Dashboard: http://127.0.0.1:5000/")
    print("   🔐 User Login:     http://127.0.0.1:5000/login.html")
    print("   🔐 Admin Login:    http://127.0.0.1:5000/admin-login.html")
    print("   👨‍💼 Admin Panel:    http://127.0.0.1:5000/admin")
    
    print("\n🔧 API ENDPOINTS:")
    print("   ✅ Health Check:    http://127.0.0.1:5000/api/health")
    print("   🔐 Auth Routes:     http://127.0.0.1:5000/api/auth/*")
    print("   📊 Trust Routes:    http://127.0.0.1:5000/api/trust/*")
    print("   👥 Admin Routes:    http://127.0.0.1:5000/api/admin/*")
    
    print("\n" + "="*60)
    print("✅ Server starting on http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
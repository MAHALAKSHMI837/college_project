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

print("Starting Continuous 2FA Authentication System...")

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

# Simple user login route
@app.route("/api/auth/login", methods=["POST"])
def simple_user_login():
    """Simple user login - accepts any username/password"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username:
            return jsonify({
                'success': False,
                'message': 'Username is required'
            }), 400
        
        # Accept any username/password for demo
        user_id = abs(hash(username)) % 1000
        token = f"token_{username}_{user_id}"
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user_id': user_id,
            'username': username
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }), 500

# Admin login route
@app.route("/api/auth/admin-login", methods=["POST"])
def admin_login():
    """Admin login"""
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Admin login attempt: {username}")
        
        if username == 'admin' and password == 'admin123':
            return jsonify({
                'success': True,
                'message': 'Admin login successful',
                'token': 'admin_token_999',
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
    # Try different locations for login.html
    login_paths = [
        os.path.join(FRONTEND_DIR, "login.html"),
        os.path.join(FRONTEND_DIR, "user", "login.html"),
        os.path.join(FRONTEND_DIR, "user", "login_user.html")
    ]
    
    for path in login_paths:
        if os.path.exists(path):
            directory = os.path.dirname(path)
            filename = os.path.basename(path)
            return send_from_directory(directory, filename)
    
    return jsonify({"error": "Login page not found"}), 404

@app.route("/admin-login.html")
def serve_admin_login():
    # Try different locations for admin-login.html
    admin_login_paths = [
        os.path.join(FRONTEND_DIR, "admin-login.html"),
        os.path.join(FRONTEND_DIR, "admin", "admin-login.html")
    ]
    
    for path in admin_login_paths:
        if os.path.exists(path):
            directory = os.path.dirname(path)
            filename = os.path.basename(path)
            return send_from_directory(directory, filename)
    
    return jsonify({"error": "Admin login page not found"}), 404

@app.route("/admin")
def serve_admin_dashboard():
    # Try trading dashboard first
    trading_path = os.path.join(FRONTEND_DIR, "admin", "trading-dashboard.html")
    if os.path.exists(trading_path):
        return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "trading-dashboard.html")
    
    # Try regular dashboard
    dashboard_path = os.path.join(FRONTEND_DIR, "admin", "index.html")
    if os.path.exists(dashboard_path):
        return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")
    
    # Return simple admin page if no dashboard found
    return '''
    <!DOCTYPE html>
    <html>
    <head><title>Admin Dashboard</title></head>
    <body style="font-family: Arial; padding: 20px; background: #1a202c; color: white;">
        <h1>Admin Dashboard</h1>
        <p>Available Dashboards:</p>
        <ul>
            <li><a href="/admin/trading" style="color: #5b8cff;">Trading Dashboard</a></li>
            <li><a href="/admin-login.html" style="color: #5b8cff;">Admin Login</a></li>
        </ul>
    </body>
    </html>
    '''

@app.route("/admin/trading")
def serve_trading_dashboard():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "trading-dashboard.html")

@app.route("/<path:filename>")
def serve_static(filename):
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
    print("CONTINUOUS 2FA AUTHENTICATION SYSTEM v2.0")
    print("="*60)
    
    print("\nAPPLICATION URLs:")
    print("   User Dashboard: http://127.0.0.1:5000/")
    print("   User Login:     http://127.0.0.1:5000/login.html")
    print("   Admin Login:    http://127.0.0.1:5000/admin-login.html")
    print("   Admin Panel:    http://127.0.0.1:5000/admin")
    print("   Trading Admin:  http://127.0.0.1:5000/admin/trading")
    
    print("\nAPI ENDPOINTS:")
    print("   Health Check:    http://127.0.0.1:5000/api/health")
    print("   User Login:      http://127.0.0.1:5000/api/auth/login")
    print("   Admin Login:     http://127.0.0.1:5000/api/auth/admin-login")
    
    print("\n" + "="*60)
    print("Server starting on http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
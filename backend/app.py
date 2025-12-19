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

# Import and register all route blueprints
try:
    from routes.device_routes import device_bp
    from routes.session_routes import session_bp
    from routes.security_routes import security_bp
    from routes.audit_routes import audit_bp
    
    app.register_blueprint(device_bp, url_prefix='/api/device')
    app.register_blueprint(session_bp, url_prefix='/api/session')
    app.register_blueprint(security_bp, url_prefix='/api/security')
    app.register_blueprint(audit_bp, url_prefix='/api/audit')
    
    print("All enterprise routes loaded successfully")
except ImportError as e:
    print(f"Warning: Could not load some routes: {e}")

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

# Import WiFi scanner
try:
    import sys
    import os
    sys.path.append(os.path.join(os.path.dirname(__file__), 'services', 'utils'))
    from wifi_scanner import get_wifi_scanner
    
    # Initialize real WiFi scanner
    wifi_scanner = get_wifi_scanner(use_simulation=False)  # Set to True for simulation
    wifi_scanner.start_continuous_scan() if hasattr(wifi_scanner, 'start_continuous_scan') else None
    print("📡 WiFi scanner initialized")
except Exception as e:
    print(f"WiFi scanner error: {e}")
    wifi_scanner = None

# API Routes for Streams and Decisions
@app.route("/api/streams/events", methods=["GET"])
def get_stream_events():
    """Get recent stream events"""
    events = [
        {"time": "14:23:45", "type": "AUTH", "title": "User authentication successful", "details": "Trust Score: 0.87 • Wi-Fi: Stable • Audio: Normal", "level": "info"},
        {"time": "14:23:42", "type": "WIFI", "title": "Wi-Fi signal fluctuation detected", "details": "RSSI dropped from -45dBm to -62dBm • AP: Office_5G", "level": "warning"},
        {"time": "14:23:38", "type": "ALERT", "title": "Anomalous behavior pattern detected", "details": "Audio entropy spike: 0.92 • Confidence: 78% • Action: Challenge", "level": "error"}
    ]
    return jsonify({"success": True, "data": events})

@app.route("/api/decisions/recent", methods=["GET"])
def get_recent_decisions():
    """Get recent AI decisions"""
    decisions = [
        {"id": "D2024-001847", "result": "ALLOW", "trust_score": 0.92, "confidence": 96, "user": "john.doe@company.com", "time": "2 minutes ago"},
        {"id": "D2024-001846", "result": "CHALLENGE", "trust_score": 0.67, "confidence": 78, "user": "sarah.wilson@company.com", "time": "5 minutes ago"},
        {"id": "D2024-001845", "result": "BLOCK", "trust_score": 0.23, "confidence": 99, "user": "unknown.user@external.com", "time": "8 minutes ago"}
    ]
    return jsonify({"success": True, "data": decisions})

@app.route("/api/decisions/feedback", methods=["POST"])
def submit_decision_feedback():
    """Submit feedback for AI decisions"""
    data = request.get_json() or {}
    decision_id = data.get('decision_id')
    feedback = data.get('feedback')  # 'correct' or 'incorrect'
    return jsonify({"success": True, "message": f"Feedback recorded for {decision_id}"})

@app.route("/api/wifi/scan", methods=["GET"])
def get_wifi_scan():
    """Get current WiFi scan results"""
    if wifi_scanner:
        try:
            networks = wifi_scanner.scan()
            stability = wifi_scanner.calculate_stability_score() if hasattr(wifi_scanner, 'calculate_stability_score') else 0.8
            fingerprint = wifi_scanner.get_network_fingerprint() if hasattr(wifi_scanner, 'get_network_fingerprint') else "unknown"
            
            return jsonify({
                "success": True,
                "data": {
                    "networks": networks,
                    "stability_score": stability,
                    "fingerprint": fingerprint,
                    "scan_time": datetime.now().isoformat()
                }
            })
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
    else:
        return jsonify({"success": False, "error": "WiFi scanner not available"}), 503

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

@app.route("/user/settings.html")
def serve_user_settings():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "settings.html")

@app.route("/user/streams.html")
def serve_user_streams():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "streams.html")

@app.route("/user/decisions.html")
def serve_user_decisions():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "decisions.html")

@app.route("/admin-security/")
def serve_admin_security():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin-security"), "index.html")

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
    
    print("\nENTERPRISE FEATURES:")
    print("   Device Management:   /api/device/*")
    print("   Session Control:     /api/session/*")
    print("   Security Policies:   /api/security/*")
    print("   Audit & Reports:     /api/audit/*")
    print("   Threat Intelligence: /api/security/threat-check")
    print("   Anomaly Detection:   /api/security/anomaly/detect")
    
    print("\n" + "="*60)
    print("Server starting on http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
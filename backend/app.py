from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.routes.user_routes import user_bp
from backend.routes.admin_routes import admin_bp
from backend.routes.auth import auth_bp
import os

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Serve frontend files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

@app.route("/")
def serve_user():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

@app.route("/login.html")
def serve_login():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

@app.route("/admin")
def serve_admin():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

@app.route("/user/<path:filename>")
def serve_user_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

@app.route("/admin/<path:filename>")
def serve_admin_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# Test endpoints
@app.route("/api/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}

@app.route("/api/test-db")
def test_db():
    from backend.utils.db import get_db
    conn = get_db()
    if conn:
        conn.close()
        return {"database": "connected"}
    else:
        return {"database": "disconnected"}, 500

if __name__ == "__main__":
    print("🚀 Starting Continuous 2FA Authentication System...")
    print("📍 Server running on http://127.0.0.1:5000")
    print("👤 User dashboard: http://127.0.0.1:5000/user")
    print("👨‍💼 Admin dashboard: http://127.0.0.1:5000/admin")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
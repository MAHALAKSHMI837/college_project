from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# Import Blueprints
from backend.routes.user_routes import user_bp
from backend.routes.admin_routes import admin_bp
from backend.routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# -------- Frontend Serving --------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Serve main frontend
@app.route("/user")
def serve_user():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# Serve admin frontend
@app.route("/admin")
def serve_admin():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# Serve static files
@app.route("/user/<path:filename>")
def serve_user_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# Serve static files
@app.route("/admin/<path:filename>")
def serve_admin_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# -------- Run Server --------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

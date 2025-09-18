from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

# For demo: hardcoded admin user
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Missing credentials"}), 400

    if data["username"] == ADMIN_USERNAME and data["password"] == ADMIN_PASSWORD:
        return jsonify({"status": "success", "role": "admin"})
    else:
        return jsonify({"error": "Invalid username or password"}), 401

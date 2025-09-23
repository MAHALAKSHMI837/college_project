from flask import Blueprint, request, jsonify
from backend.models.user_model import create_user  

# Blueprint for user routes
user_bp = Blueprint("user", __name__)

# Register a new user
@user_bp.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()

        # Validate input
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        if "username" not in data or "device" not in data:
            return jsonify({"error": "Missing 'username' or 'device' field"}), 400

        # Call model function
        create_user(data["username"], data["device"])

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Get decisions for a specific user
@user_bp.route("/decisions/<int:user_id>", methods=["GET"])
def get_user_decisions(user_id):
    try:
        from backend.models.decision_model import get_decisions_for_user
        decisions = get_decisions_for_user(user_id)
        return jsonify({"items": decisions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


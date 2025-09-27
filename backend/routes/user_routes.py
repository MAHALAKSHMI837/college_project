from flask import Blueprint, request, jsonify
from backend.models.user_model import create_user  
from backend.utils.wifi_scanner import get_wifi_scanner
from backend.middleware.auth import token_required  

# Blueprint for user routes
user_bp = Blueprint("user", __name__)

# Initialize WiFi scanner
wifi_scanner = get_wifi_scanner(use_simulation=True)  # Set to False for real scanning

@user_bp.route("/wifi/scan", methods=["GET"])
@token_required
def wifi_scan():
    """Get current WiFi scan results"""
    try:
        aps = wifi_scanner.scan()
        return jsonify({
            "success": True,
            "access_points": aps,
            "total_aps": len(aps),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/wifi/stability", methods=["GET"])
@token_required
def wifi_stability():
    """Get WiFi stability score"""
    try:
        stability = wifi_scanner.calculate_stability_score()
        fingerprint = wifi_scanner.get_network_fingerprint()
        
        return jsonify({
            "success": True,
            "stability_score": round(stability, 3),
            "network_fingerprint": fingerprint,
            "interpretation": get_stability_interpretation(stability)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/wifi/start-monitoring", methods=["POST"])
@token_required
def start_wifi_monitoring():
    """Start continuous WiFi monitoring"""
    try:
        if hasattr(wifi_scanner, 'start_continuous_scan'):
            wifi_scanner.start_continuous_scan()
            return jsonify({
                "success": True,
                "message": "WiFi monitoring started",
                "scan_interval": getattr(wifi_scanner, 'scan_interval', 30)
            })
        else:
            return jsonify({"error": "Continuous scanning not supported"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_stability_interpretation(score):
    """Convert stability score to human-readable interpretation"""
    if score >= 0.8:
        return "Excellent stability - familiar environment"
    elif score >= 0.6:
        return "Good stability - normal variations"
    elif score >= 0.4:
        return "Moderate stability - some movement detected"
    else:
        return "Low stability - significant environmental changes"

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
    
# # Get decisions for a specific user
# @user_bp.route("/decisions/<int:user_id>", methods=["GET"])
# def get_user_decisions(user_id):
#     try:
#         from backend.models.decision_model import get_user_decisions
#         decisions = get_user_decisions(user_id)
#         return jsonify({"items": decisions})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@user_bp.route("/decisions/<int:user_id>", methods=["GET"])
@token_required  # This should work now
def get_decisions(user_id):
    """Get decisions for a specific user"""
    # Verify the user is accessing their own data
    if request.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    decisions = get_user_decisions(user_id)
    return jsonify(decisions)

@user_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    """Get user profile"""
    from backend.models.user_model import get_user_by_id
    
    user = get_user_by_id(request.user_id)
    if user:
        # Don't return password hash
        return jsonify({
            "id": user["id"],
            "username": user["username"],
            "device": user["device"],
            "created_at": user["created_at"]
        })
    return jsonify({"error": "User not found"}), 404

# Simple test endpoint without authentication
@user_bp.route("/test", methods=["GET"])
def test_endpoint():
    return jsonify({"message": "User routes are working!"})

"""
User routes for user-specific operations
"""
from flask import Blueprint, request, jsonify, g
from models.user_model import UserModel
from models.decision_model import DecisionModel
from utils.helpers import response_helper
from middleware.security import require_auth, rate_limit

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get user profile"""
    try:
        user_id = g.user_id
        user = UserModel.get_user_by_id(user_id)
        
        if not user:
            return jsonify(response_helper.error_response("User not found")), 404
        
        return jsonify(response_helper.success_response(user))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get profile: {str(e)}")), 500

@user_bp.route('/decisions', methods=['GET'])
@require_auth
def get_user_decisions():
    """Get user's recent decisions"""
    try:
        user_id = g.user_id
        limit = request.args.get('limit', 20, type=int)
        
        decisions = DecisionModel.get_decisions_by_user(user_id, limit)
        return jsonify(response_helper.success_response(decisions))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get decisions: {str(e)}")), 500

@user_bp.route('/decisions/<int:user_id>', methods=['GET'])
@require_auth
def get_specific_user_decisions(user_id):
    """Get decisions for specific user (admin or self only)"""
    try:
        current_user = g.user_id
        
        # Users can only access their own decisions
        if current_user != user_id:
            return jsonify(response_helper.error_response("Access denied")), 403
        
        limit = request.args.get('limit', 20, type=int)
        decisions = DecisionModel.get_decisions_by_user(user_id, limit)
        
        return jsonify(response_helper.success_response(decisions))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get decisions: {str(e)}")), 500

@user_bp.route('/test', methods=['GET'])
def test_user():
    """Test user routes"""
    return jsonify(response_helper.success_response({'message': 'User routes working'}))
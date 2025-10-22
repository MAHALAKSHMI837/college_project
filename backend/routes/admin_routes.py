"""
Admin routes for system management
"""
from flask import Blueprint, request, jsonify
from models.user_model import UserModel
from models.decision_model import DecisionModel
from utils.helpers import response_helper
from middleware.security import require_auth, rate_limit

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@rate_limit(limit=50, window=60)
def get_all_users():
    """Get all users"""
    try:
        users = UserModel.get_all_users()
        return jsonify(response_helper.success_response(users))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get users: {str(e)}")), 500

@admin_bp.route('/decisions', methods=['GET'])
@rate_limit(limit=50, window=60)
def get_all_decisions():
    """Get all decisions"""
    try:
        limit = request.args.get('limit', 100, type=int)
        decisions = DecisionModel.get_all_decisions(limit)
        return jsonify(response_helper.success_response(decisions))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get decisions: {str(e)}")), 500

@admin_bp.route('/stats', methods=['GET'])
@rate_limit(limit=20, window=60)
def get_system_stats():
    """Get system statistics"""
    try:
        # Get decision stats
        decision_stats = DecisionModel.get_decision_stats()
        
        # Get user count
        users = UserModel.get_all_users()
        user_count = len(users)
        
        stats = {
            'total_users': user_count,
            'total_decisions': decision_stats['total_decisions'],
            'decision_breakdown': decision_stats['decision_breakdown'],
            'average_trust_score': decision_stats['average_trust_score'],
            'system_status': 'operational'
        }
        
        return jsonify(response_helper.success_response(stats))
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get stats: {str(e)}")), 500

@admin_bp.route('/test', methods=['GET'])
def test_admin():
    """Test admin routes"""
    return jsonify(response_helper.success_response({'message': 'Admin routes working'}))
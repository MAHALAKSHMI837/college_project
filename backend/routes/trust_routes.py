"""
Trust calculation routes
"""
from flask import Blueprint, request, jsonify, g
from services.trust_calculator import trust_calculator
from models.decision_model import DecisionModel
from utils.validators import validator
from utils.helpers import response_helper
from middleware.security import require_auth, rate_limit

trust_bp = Blueprint('trust', __name__)

@trust_bp.route('/calculate', methods=['POST'])
@rate_limit(limit=100, window=60)  # 100 calculations per minute
def calculate_trust():
    """Calculate trust score based on behavioral data"""
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id')
        behavioral_data = data.get('behavioral_data', {})
        
        # Validate user_id
        if not validator.validate_user_id(user_id):
            return jsonify(response_helper.error_response("Invalid user ID")), 400
        
        # Calculate trust score
        result = trust_calculator.calculate_trust_score(user_id, behavioral_data)
        
        # Save decision to database
        DecisionModel.create_decision(
            user_id=user_id,
            trust_score=result['trust_score'],
            result=result['decision'],
            note=result['note']
        )
        
        return jsonify(response_helper.success_response(result, "Trust score calculated"))
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Trust calculation failed: {str(e)}")), 500

@trust_bp.route('/score', methods=['POST'])
@rate_limit(limit=50, window=60)
def get_trust_score():
    """Get trust score (legacy endpoint)"""
    return calculate_trust()

@trust_bp.route('/history/<int:user_id>', methods=['GET'])
@require_auth
def get_trust_history(user_id):
    """Get user's trust score history"""
    try:
        # Check if user can access this data
        current_user = g.user_id
        if current_user != user_id:
            return jsonify(response_helper.error_response("Access denied")), 403
        
        history = trust_calculator.get_user_trust_trend(user_id)
        decisions = DecisionModel.get_decisions_by_user(user_id, limit=20)
        
        return jsonify(response_helper.success_response({
            'trust_history': history,
            'recent_decisions': decisions
        }))
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to get history: {str(e)}")), 500

@trust_bp.route('/test', methods=['GET'])
def test_trust():
    """Test endpoint for trust system"""
    return jsonify(response_helper.success_response({
        'message': 'Trust system is operational',
        'services_active': {
            'wifi': trust_calculator.wifi_enabled,
            'audio': trust_calculator.audio_enabled,
            'smartwatch': trust_calculator.smartwatch_enabled
        }
    }))
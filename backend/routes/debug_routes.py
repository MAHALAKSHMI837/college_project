"""
Debug routes for testing and data creation
"""
from flask import Blueprint, jsonify
from models.user_model import UserModel
from models.decision_model import DecisionModel
from utils.helpers import response_helper
import random

debug_bp = Blueprint('debug', __name__)

@debug_bp.route('/create-test-data', methods=['POST'])
def create_test_data():
    """Create test data for development"""
    try:
        # Create test decisions for existing users
        users = UserModel.get_all_users()
        
        if not users:
            return jsonify(response_helper.error_response("No users found to create decisions for")), 400
        
        decisions_created = 0
        
        for user in users:
            # Create 3-5 random decisions per user
            num_decisions = random.randint(3, 5)
            
            for _ in range(num_decisions):
                trust_score = random.uniform(0.2, 0.95)
                
                if trust_score >= 0.7:
                    result = "ALLOW"
                    note = "Normal behavior pattern detected"
                elif trust_score >= 0.4:
                    result = "CHALLENGE"
                    note = "Additional verification required"
                else:
                    result = "BLOCK"
                    note = "Suspicious activity detected"
                
                decision_id = DecisionModel.create_decision(
                    user_id=user['id'],
                    trust_score=trust_score,
                    result=result,
                    note=note
                )
                
                if decision_id:
                    decisions_created += 1
        
        return jsonify(response_helper.success_response({
            'decisions_created': decisions_created,
            'users_processed': len(users)
        }, f"Created {decisions_created} test decisions"))
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Failed to create test data: {str(e)}")), 500

@debug_bp.route('/stats', methods=['GET'])
def debug_stats():
    """Get debug statistics"""
    try:
        users = UserModel.get_all_users()
        stats = DecisionModel.get_decision_stats()
        
        return jsonify(response_helper.success_response({
            'users_count': len(users),
            'decisions_stats': stats,
            'users': users[:3]  # First 3 users for debugging
        }))
        
    except Exception as e:
        return jsonify(response_helper.error_response(f"Debug stats failed: {str(e)}")), 500
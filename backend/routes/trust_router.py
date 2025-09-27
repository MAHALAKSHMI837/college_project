# # backend/routes/trust_routes.py
# from flask import Blueprint, request, jsonify
# from backend.services.trust_calculation import TrustCalculator

# trust_bp = Blueprint('trust', __name__)
# trust_calculator = TrustCalculator()

# @trust_bp.route('/score', methods=['POST'])
# def get_trust_score():
#     try:
#         data = request.get_json()
        
#         if not data:
#             return jsonify({'error': 'No data provided'}), 400
        
#         user_id = data.get('user_id')
#         behavioral_data = data.get('behavioral_data', {})
        
#         # Get user baseline from database
#         user_baseline = get_user_baseline(user_id)  # Implement this function
        
#         trust_score = trust_calculator.calculate_trust_score(
#             behavioral_data, 
#             user_baseline
#         )
        
#         return jsonify({
#             'trust_score': trust_score,
#             'confidence': 'high' if trust_score > 0.7 else 'medium' if trust_score > 0.4 else 'low'
#         })
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Placeholder function - you'll need to implement this based on your database
# def get_user_baseline(user_id):
#     # For now, return a mock baseline
#     return {
#         'typing_baseline': {'speed': 50, 'rhythm': 0.8},
#         'mouse_baseline': {'speed': 100, 'accuracy': 0.9}
#     }


from flask import Blueprint, request, jsonify

trust_bp = Blueprint('trust', __name__)

@trust_bp.route('/score', methods=['POST'])
def get_trust_score():
    """Calculate trust score based on behavioral data"""
    try:
        data = request.get_json()
        print("📊 Trust score request received:", data)
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_id = data.get('user_id')
        behavioral_data = data.get('behavioral_data', {})
        
        # Mock trust score calculation for now
        # Replace this with actual calculation from your TrustCalculator
        trust_score = 0.85  # Mock score for testing
        
        # Simple calculation based on available data
        if behavioral_data:
            # If we have some behavioral data, adjust score slightly
            if behavioral_data.get('typing_metrics'):
                trust_score += 0.05
            if behavioral_data.get('mouse_metrics'):
                trust_score += 0.05
            if behavioral_data.get('context'):
                trust_score += 0.03
        
        # Ensure score is between 0 and 1
        trust_score = max(0.1, min(0.99, trust_score))
        
        # Determine confidence level
        if trust_score > 0.7:
            confidence = 'high'
        elif trust_score > 0.4:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        print(f"✅ Trust score calculated: {trust_score}, confidence: {confidence}")
        
        return jsonify({
            'trust_score': trust_score,
            'confidence': confidence,
            'status': 'success',
            'user_id': user_id
        })
        
    except Exception as e:
        print(f"❌ Trust calculation error: {e}")
        return jsonify({'error': str(e), 'trust_score': 0.5}), 500

@trust_bp.route('/test', methods=['GET'])
def test_trust():
    """Test endpoint to verify trust router is working"""
    return jsonify({
        'message': 'Trust router is working!', 
        'status': 'success',
        'test_trust_score': 0.75
    })

@trust_bp.route('/mock-data', methods=['GET'])
def get_mock_trust_data():
    """Provide mock trust data for frontend testing"""
    return jsonify({
        'trust_score': 0.82,
        'confidence': 'high',
        'behavioral_metrics': {
            'typing_speed': 45,
            'typing_rhythm': 0.7,
            'mouse_speed': 95,
            'click_accuracy': 0.8
        },
        'status': 'success'
    })

@trust_bp.route('/health', methods=['GET'])
def trust_health():
    """Health check for trust routes"""
    return jsonify({"status": "healthy", "service": "trust"})

@trust_bp.route('/test')
def test_trust():
    return jsonify({'message': 'Trust blueprint is working!', 'status': 'success'})

@trust_bp.route('/score', methods=['POST'])
def get_trust_score():
    return jsonify({'trust_score': 0.85, 'confidence': 'high'})
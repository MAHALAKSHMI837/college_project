from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import hashlib
import json

device_bp = Blueprint('device', __name__)

# In-memory device storage (replace with database)
devices = {}
device_trust_scores = {}

@device_bp.route('/register', methods=['POST'])
def register_device():
    """Register a new device fingerprint"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        device_info = data.get('device_info', {})
        
        # Generate device fingerprint
        fingerprint_data = {
            'browser': device_info.get('browser', 'Unknown'),
            'os': device_info.get('os', 'Unknown'),
            'screen_resolution': device_info.get('screen_resolution', ''),
            'timezone': device_info.get('timezone', ''),
            'language': device_info.get('language', 'en')
        }
        
        device_id = hashlib.sha256(json.dumps(fingerprint_data, sort_keys=True).encode()).hexdigest()[:16]
        
        device_record = {
            'device_id': device_id,
            'user_id': user_id,
            'fingerprint': fingerprint_data,
            'ip_address': request.remote_addr,
            'location': data.get('location', {}),
            'trust_score': 0.8,  # Initial trust
            'first_seen': datetime.now(timezone.utc).isoformat(),
            'last_seen': datetime.now(timezone.utc).isoformat(),
            'status': 'active'
        }
        
        devices[device_id] = device_record
        device_trust_scores[device_id] = [0.8]
        
        return jsonify({
            'success': True,
            'data': {
                'device_id': device_id,
                'trust_score': 0.8,
                'status': 'registered'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@device_bp.route('/check', methods=['POST'])
def check_device():
    """Check device trust and update score"""
    try:
        data = request.get_json()
        device_id = data.get('device_id')
        behavioral_data = data.get('behavioral_data', {})
        
        if device_id not in devices:
            return jsonify({
                'success': False,
                'error': 'Device not found',
                'action': 'register_required'
            }), 404
        
        device = devices[device_id]
        
        # Update trust score based on behavior
        current_trust = device['trust_score']
        
        # Simple trust calculation
        location_match = behavioral_data.get('location_consistent', True)
        time_pattern_normal = behavioral_data.get('time_pattern_normal', True)
        ip_consistent = behavioral_data.get('ip_consistent', True)
        
        trust_adjustment = 0
        if not location_match:
            trust_adjustment -= 0.2
        if not time_pattern_normal:
            trust_adjustment -= 0.1
        if not ip_consistent:
            trust_adjustment -= 0.15
            
        new_trust = max(0.0, min(1.0, current_trust + trust_adjustment))
        
        device['trust_score'] = new_trust
        device['last_seen'] = datetime.now(timezone.utc).isoformat()
        device_trust_scores[device_id].append(new_trust)
        
        # Keep only last 50 scores
        if len(device_trust_scores[device_id]) > 50:
            device_trust_scores[device_id] = device_trust_scores[device_id][-50:]
        
        return jsonify({
            'success': True,
            'data': {
                'device_id': device_id,
                'trust_score': new_trust,
                'trust_trend': device_trust_scores[device_id][-10:],
                'risk_level': 'low' if new_trust > 0.7 else 'medium' if new_trust > 0.4 else 'high'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@device_bp.route('/list/<user_id>', methods=['GET'])
def list_user_devices(user_id):
    """List all devices for a user"""
    try:
        user_devices = [device for device in devices.values() if str(device['user_id']) == str(user_id)]
        
        return jsonify({
            'success': True,
            'data': {
                'devices': user_devices,
                'total_count': len(user_devices)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
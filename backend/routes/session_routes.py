from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
import uuid

session_bp = Blueprint('session', __name__)

# In-memory session storage (replace with database)
active_sessions = {}
session_history = []

@session_bp.route('/start', methods=['POST'])
def start_session():
    """Start a new user session"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        device_id = data.get('device_id')
        
        session_id = str(uuid.uuid4())
        
        session_data = {
            'session_id': session_id,
            'user_id': user_id,
            'device_id': device_id,
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'start_time': datetime.now(timezone.utc).isoformat(),
            'last_activity': datetime.now(timezone.utc).isoformat(),
            'behavior_score': 0.8,
            'activity_count': 0,
            'status': 'active',
            'location': data.get('location', {}),
            'risk_events': []
        }
        
        active_sessions[session_id] = session_data
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'expires_at': (datetime.now(timezone.utc) + timedelta(hours=8)).isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/update', methods=['POST'])
def update_session():
    """Update session activity and behavior score"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        activity_data = data.get('activity_data', {})
        
        if session_id not in active_sessions:
            return jsonify({
                'success': False,
                'error': 'Session not found or expired'
            }), 404
        
        session = active_sessions[session_id]
        
        # Update activity
        session['last_activity'] = datetime.now(timezone.utc).isoformat()
        session['activity_count'] += 1
        
        # Update behavior score
        current_score = session['behavior_score']
        
        # Analyze activity patterns
        suspicious_activity = activity_data.get('suspicious_activity', False)
        rapid_requests = activity_data.get('rapid_requests', False)
        unusual_patterns = activity_data.get('unusual_patterns', False)
        
        score_adjustment = 0
        if suspicious_activity:
            score_adjustment -= 0.1
            session['risk_events'].append({
                'type': 'suspicious_activity',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'details': activity_data.get('details', '')
            })
        
        if rapid_requests:
            score_adjustment -= 0.05
            
        if unusual_patterns:
            score_adjustment -= 0.08
        
        new_score = max(0.0, min(1.0, current_score + score_adjustment))
        session['behavior_score'] = new_score
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'behavior_score': new_score,
                'risk_level': 'low' if new_score > 0.7 else 'medium' if new_score > 0.4 else 'high',
                'activity_count': session['activity_count']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/active', methods=['GET'])
def get_active_sessions():
    """Get all active sessions"""
    try:
        # Clean expired sessions (older than 8 hours)
        current_time = datetime.now(timezone.utc)
        expired_sessions = []
        
        for session_id, session in active_sessions.items():
            start_time = datetime.fromisoformat(session['start_time'].replace('Z', '+00:00'))
            if current_time - start_time > timedelta(hours=8):
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            session_history.append(active_sessions[session_id])
            del active_sessions[session_id]
        
        return jsonify({
            'success': True,
            'data': {
                'active_sessions': list(active_sessions.values()),
                'total_count': len(active_sessions),
                'expired_cleaned': len(expired_sessions)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/terminate', methods=['POST'])
def terminate_session():
    """Terminate a specific session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        reason = data.get('reason', 'manual_termination')
        
        if session_id not in active_sessions:
            return jsonify({
                'success': False,
                'error': 'Session not found'
            }), 404
        
        session = active_sessions[session_id]
        session['status'] = 'terminated'
        session['end_time'] = datetime.now(timezone.utc).isoformat()
        session['termination_reason'] = reason
        
        # Move to history
        session_history.append(session)
        del active_sessions[session_id]
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'status': 'terminated',
                'reason': reason
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@session_bp.route('/user/<user_id>', methods=['GET'])
def get_user_sessions(user_id):
    """Get all sessions for a specific user"""
    try:
        user_active = [s for s in active_sessions.values() if str(s['user_id']) == str(user_id)]
        user_history = [s for s in session_history if str(s['user_id']) == str(user_id)][-10:]  # Last 10
        
        return jsonify({
            'success': True,
            'data': {
                'active_sessions': user_active,
                'recent_history': user_history,
                'active_count': len(user_active)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
import json

security_bp = Blueprint('security', __name__)

# Security policies storage
security_policies = {
    'mfa_required': True,
    'max_failed_attempts': 5,
    'session_timeout_hours': 8,
    'password_complexity': {
        'min_length': 8,
        'require_uppercase': True,
        'require_lowercase': True,
        'require_numbers': True,
        'require_special': True
    },
    'ip_restrictions': {
        'enabled': False,
        'whitelist': [],
        'blacklist': ['203.45.67.89', '192.168.100.100']
    },
    'geo_restrictions': {
        'enabled': True,
        'allowed_countries': ['IN', 'US', 'GB'],
        'blocked_countries': ['RU', 'CN']
    },
    'time_restrictions': {
        'enabled': False,
        'allowed_hours': {'start': 6, 'end': 22}
    }
}

# Threat intelligence data
threat_intelligence = {
    'malicious_ips': [
        '203.45.67.89', '192.168.100.100', '10.0.0.999',
        '185.220.101.1', '198.51.100.1'
    ],
    'bot_networks': [
        '203.45.67.0/24', '192.168.100.0/24'
    ],
    'suspicious_patterns': [
        'rapid_login_attempts',
        'multiple_device_access',
        'unusual_time_access',
        'geo_hopping'
    ]
}

# Security alerts storage
security_alerts = []

@security_bp.route('/policies', methods=['GET'])
def get_security_policies():
    """Get current security policies"""
    try:
        return jsonify({
            'success': True,
            'data': security_policies
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@security_bp.route('/policy/update', methods=['POST'])
def update_security_policy():
    """Update security policies"""
    try:
        data = request.get_json()
        policy_key = data.get('policy_key')
        policy_value = data.get('policy_value')
        
        if policy_key in security_policies:
            security_policies[policy_key] = policy_value
            
            # Log policy change
            alert = {
                'id': f'POL-{len(security_alerts) + 1:04d}',
                'type': 'policy_change',
                'severity': 'medium',
                'message': f'Security policy updated: {policy_key}',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'details': {
                    'policy': policy_key,
                    'new_value': policy_value,
                    'changed_by': data.get('admin_id', 'system')
                },
                'status': 'open'
            }
            security_alerts.append(alert)
            
            return jsonify({
                'success': True,
                'data': {
                    'policy_key': policy_key,
                    'new_value': policy_value,
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid policy key'
            }), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@security_bp.route('/threat-check', methods=['POST'])
def check_threat_intelligence():
    """Check IP/pattern against threat intelligence"""
    try:
        data = request.get_json()
        ip_address = data.get('ip_address')
        user_pattern = data.get('pattern', {})
        
        threats_detected = []
        risk_score = 0.0
        
        # Check malicious IPs
        if ip_address in threat_intelligence['malicious_ips']:
            threats_detected.append({
                'type': 'malicious_ip',
                'severity': 'high',
                'description': f'IP {ip_address} is in malicious IP database'
            })
            risk_score += 0.8
        
        # Check bot networks
        for network in threat_intelligence['bot_networks']:
            if ip_address.startswith(network.split('/')[0][:10]):  # Simple check
                threats_detected.append({
                    'type': 'bot_network',
                    'severity': 'high',
                    'description': f'IP {ip_address} belongs to known bot network'
                })
                risk_score += 0.7
        
        # Check suspicious patterns
        rapid_attempts = user_pattern.get('rapid_attempts', False)
        multiple_devices = user_pattern.get('multiple_devices', False)
        unusual_time = user_pattern.get('unusual_time', False)
        
        if rapid_attempts:
            threats_detected.append({
                'type': 'rapid_attempts',
                'severity': 'medium',
                'description': 'Rapid login attempts detected'
            })
            risk_score += 0.3
        
        if multiple_devices:
            threats_detected.append({
                'type': 'multiple_devices',
                'severity': 'medium',
                'description': 'Multiple device access detected'
            })
            risk_score += 0.2
        
        if unusual_time:
            threats_detected.append({
                'type': 'unusual_time',
                'severity': 'low',
                'description': 'Access at unusual time detected'
            })
            risk_score += 0.1
        
        # Generate alert if threats found
        if threats_detected:
            alert = {
                'id': f'THR-{len(security_alerts) + 1:04d}',
                'type': 'threat_detected',
                'severity': 'high' if risk_score > 0.6 else 'medium' if risk_score > 0.3 else 'low',
                'message': f'Threats detected from IP {ip_address}',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'details': {
                    'ip_address': ip_address,
                    'threats': threats_detected,
                    'risk_score': risk_score
                },
                'status': 'open'
            }
            security_alerts.append(alert)
        
        return jsonify({
            'success': True,
            'data': {
                'threats_detected': threats_detected,
                'risk_score': min(1.0, risk_score),
                'recommendation': 'block' if risk_score > 0.7 else 'challenge' if risk_score > 0.4 else 'allow'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@security_bp.route('/alerts', methods=['GET'])
def get_security_alerts():
    """Get security alerts"""
    try:
        limit = request.args.get('limit', 50, type=int)
        severity = request.args.get('severity')
        status = request.args.get('status')
        
        filtered_alerts = security_alerts.copy()
        
        if severity:
            filtered_alerts = [a for a in filtered_alerts if a['severity'] == severity]
        
        if status:
            filtered_alerts = [a for a in filtered_alerts if a['status'] == status]
        
        # Sort by timestamp (newest first)
        filtered_alerts.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': {
                'alerts': filtered_alerts[:limit],
                'total_count': len(security_alerts),
                'filtered_count': len(filtered_alerts)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@security_bp.route('/alerts/resolve', methods=['POST'])
def resolve_alert():
    """Resolve a security alert"""
    try:
        data = request.get_json()
        alert_id = data.get('alert_id')
        resolution_note = data.get('resolution_note', '')
        
        for alert in security_alerts:
            if alert['id'] == alert_id:
                alert['status'] = 'resolved'
                alert['resolved_at'] = datetime.now(timezone.utc).isoformat()
                alert['resolution_note'] = resolution_note
                alert['resolved_by'] = data.get('admin_id', 'system')
                
                return jsonify({
                    'success': True,
                    'data': {
                        'alert_id': alert_id,
                        'status': 'resolved',
                        'resolved_at': alert['resolved_at']
                    }
                })
        
        return jsonify({
            'success': False,
            'error': 'Alert not found'
        }), 404
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@security_bp.route('/anomaly/detect', methods=['POST'])
def detect_anomaly():
    """Detect anomalies in user behavior"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        behavior_data = data.get('behavior_data', {})
        
        anomalies = []
        anomaly_score = 0.0
        
        # Check location anomaly
        current_location = behavior_data.get('location', {})
        usual_location = behavior_data.get('usual_location', {})
        
        if current_location and usual_location:
            # Simple distance check (in real implementation, use proper geo calculation)
            lat_diff = abs(current_location.get('lat', 0) - usual_location.get('lat', 0))
            lon_diff = abs(current_location.get('lon', 0) - usual_location.get('lon', 0))
            
            if lat_diff > 5 or lon_diff > 5:  # Rough distance check
                anomalies.append({
                    'type': 'location_anomaly',
                    'severity': 'high',
                    'description': 'Login from unusual location detected'
                })
                anomaly_score += 0.6
        
        # Check time anomaly
        current_hour = datetime.now().hour
        usual_hours = behavior_data.get('usual_login_hours', [8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
        
        if current_hour not in usual_hours:
            anomalies.append({
                'type': 'time_anomaly',
                'severity': 'medium',
                'description': f'Login at unusual time: {current_hour}:00'
            })
            anomaly_score += 0.3
        
        # Check device anomaly
        current_device = behavior_data.get('device_fingerprint', '')
        known_devices = behavior_data.get('known_devices', [])
        
        if current_device and current_device not in known_devices:
            anomalies.append({
                'type': 'device_anomaly',
                'severity': 'high',
                'description': 'Login from unknown device detected'
            })
            anomaly_score += 0.5
        
        # Generate alert if anomalies found
        if anomalies:
            alert = {
                'id': f'ANO-{len(security_alerts) + 1:04d}',
                'type': 'anomaly_detected',
                'severity': 'high' if anomaly_score > 0.6 else 'medium' if anomaly_score > 0.3 else 'low',
                'message': f'Behavioral anomalies detected for user {user_id}',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'details': {
                    'user_id': user_id,
                    'anomalies': anomalies,
                    'anomaly_score': anomaly_score
                },
                'status': 'open'
            }
            security_alerts.append(alert)
        
        return jsonify({
            'success': True,
            'data': {
                'anomalies_detected': anomalies,
                'anomaly_score': min(1.0, anomaly_score),
                'recommendation': 'block' if anomaly_score > 0.7 else 'challenge' if anomaly_score > 0.4 else 'allow'
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
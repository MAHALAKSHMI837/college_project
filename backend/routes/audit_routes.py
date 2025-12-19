from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta
import json
import csv
import io

audit_bp = Blueprint('audit', __name__)

# Audit logs storage
audit_logs = []
system_events = []

def log_event(event_type, user_id=None, details=None, severity='info'):
    """Log an audit event"""
    event = {
        'id': f'AUD-{len(audit_logs) + 1:06d}',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'event_type': event_type,
        'user_id': user_id,
        'ip_address': request.remote_addr if request else 'system',
        'user_agent': request.headers.get('User-Agent', '') if request else 'system',
        'severity': severity,
        'details': details or {},
        'session_id': request.headers.get('X-Session-ID', '') if request else ''
    }
    audit_logs.append(event)
    return event

@audit_bp.route('/logs', methods=['GET'])
def get_audit_logs():
    """Get audit logs with filtering"""
    try:
        # Query parameters
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        event_type = request.args.get('event_type')
        user_id = request.args.get('user_id')
        severity = request.args.get('severity')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        filtered_logs = audit_logs.copy()
        
        # Apply filters
        if event_type:
            filtered_logs = [log for log in filtered_logs if log['event_type'] == event_type]
        
        if user_id:
            filtered_logs = [log for log in filtered_logs if str(log.get('user_id', '')) == str(user_id)]
        
        if severity:
            filtered_logs = [log for log in filtered_logs if log['severity'] == severity]
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            filtered_logs = [log for log in filtered_logs 
                           if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) >= start_dt]
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            filtered_logs = [log for log in filtered_logs 
                           if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) <= end_dt]
        
        # Sort by timestamp (newest first)
        filtered_logs.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Pagination
        paginated_logs = filtered_logs[offset:offset + limit]
        
        return jsonify({
            'success': True,
            'data': {
                'logs': paginated_logs,
                'total_count': len(audit_logs),
                'filtered_count': len(filtered_logs),
                'offset': offset,
                'limit': limit
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@audit_bp.route('/log', methods=['POST'])
def create_audit_log():
    """Create a new audit log entry"""
    try:
        data = request.get_json()
        
        event = log_event(
            event_type=data.get('event_type'),
            user_id=data.get('user_id'),
            details=data.get('details', {}),
            severity=data.get('severity', 'info')
        )
        
        return jsonify({
            'success': True,
            'data': event
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@audit_bp.route('/reports/daily', methods=['GET'])
def generate_daily_report():
    """Generate daily security report"""
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Filter logs for the target date
        daily_logs = [
            log for log in audit_logs
            if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')).date() == target_date
        ]
        
        # Generate statistics
        event_types = {}
        severity_counts = {'info': 0, 'warning': 0, 'error': 0, 'critical': 0}
        user_activity = {}
        
        for log in daily_logs:
            # Count event types
            event_type = log['event_type']
            event_types[event_type] = event_types.get(event_type, 0) + 1
            
            # Count severity levels
            severity = log['severity']
            if severity in severity_counts:
                severity_counts[severity] += 1
            
            # Count user activity
            user_id = log.get('user_id')
            if user_id:
                user_activity[user_id] = user_activity.get(user_id, 0) + 1
        
        report = {
            'date': date_str,
            'total_events': len(daily_logs),
            'event_types': event_types,
            'severity_breakdown': severity_counts,
            'top_active_users': sorted(user_activity.items(), key=lambda x: x[1], reverse=True)[:10],
            'generated_at': datetime.now(timezone.utc).isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': report
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@audit_bp.route('/reports/weekly', methods=['GET'])
def generate_weekly_report():
    """Generate weekly incident report"""
    try:
        # Get last 7 days
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=7)
        
        weekly_logs = [
            log for log in audit_logs
            if start_date <= datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')).date() <= end_date
        ]
        
        # Security incidents (warnings, errors, critical)
        incidents = [log for log in weekly_logs if log['severity'] in ['warning', 'error', 'critical']]
        
        # Daily breakdown
        daily_stats = {}
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.strftime('%Y-%m-%d')
            
            day_logs = [log for log in weekly_logs 
                       if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')).date() == current_date]
            
            daily_stats[date_str] = {
                'total_events': len(day_logs),
                'incidents': len([log for log in day_logs if log['severity'] in ['warning', 'error', 'critical']]),
                'logins': len([log for log in day_logs if log['event_type'] == 'login']),
                'failed_attempts': len([log for log in day_logs if log['event_type'] == 'login_failed'])
            }
        
        report = {
            'period': f'{start_date} to {end_date}',
            'total_events': len(weekly_logs),
            'total_incidents': len(incidents),
            'daily_breakdown': daily_stats,
            'top_incidents': sorted(incidents, key=lambda x: x['timestamp'], reverse=True)[:20],
            'generated_at': datetime.now(timezone.utc).isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': report
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@audit_bp.route('/reports/user-risk', methods=['GET'])
def generate_user_risk_report():
    """Generate user risk assessment report"""
    try:
        # Analyze user behavior patterns
        user_risks = {}
        
        # Get last 30 days of logs
        cutoff_date = datetime.now() - timedelta(days=30)
        
        recent_logs = [
            log for log in audit_logs
            if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) >= cutoff_date
        ]
        
        for log in recent_logs:
            user_id = log.get('user_id')
            if not user_id:
                continue
            
            if user_id not in user_risks:
                user_risks[user_id] = {
                    'user_id': user_id,
                    'total_events': 0,
                    'failed_logins': 0,
                    'security_incidents': 0,
                    'unusual_activity': 0,
                    'risk_score': 0.0,
                    'risk_level': 'low'
                }
            
            user_risk = user_risks[user_id]
            user_risk['total_events'] += 1
            
            if log['event_type'] == 'login_failed':
                user_risk['failed_logins'] += 1
            
            if log['severity'] in ['warning', 'error', 'critical']:
                user_risk['security_incidents'] += 1
            
            if log['event_type'] in ['anomaly_detected', 'suspicious_activity']:
                user_risk['unusual_activity'] += 1
        
        # Calculate risk scores
        for user_id, risk_data in user_risks.items():
            score = 0.0
            
            # Failed login ratio
            if risk_data['total_events'] > 0:
                failed_ratio = risk_data['failed_logins'] / risk_data['total_events']
                score += failed_ratio * 0.4
            
            # Security incidents
            score += min(risk_data['security_incidents'] * 0.1, 0.3)
            
            # Unusual activity
            score += min(risk_data['unusual_activity'] * 0.15, 0.3)
            
            risk_data['risk_score'] = min(1.0, score)
            
            if score > 0.7:
                risk_data['risk_level'] = 'high'
            elif score > 0.4:
                risk_data['risk_level'] = 'medium'
            else:
                risk_data['risk_level'] = 'low'
        
        # Sort by risk score
        sorted_risks = sorted(user_risks.values(), key=lambda x: x['risk_score'], reverse=True)
        
        report = {
            'analysis_period': '30 days',
            'total_users_analyzed': len(user_risks),
            'high_risk_users': len([u for u in sorted_risks if u['risk_level'] == 'high']),
            'medium_risk_users': len([u for u in sorted_risks if u['risk_level'] == 'medium']),
            'low_risk_users': len([u for u in sorted_risks if u['risk_level'] == 'low']),
            'user_risk_data': sorted_risks,
            'generated_at': datetime.now(timezone.utc).isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': report
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@audit_bp.route('/export/csv', methods=['GET'])
def export_logs_csv():
    """Export audit logs as CSV"""
    try:
        # Get query parameters for filtering
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        event_type = request.args.get('event_type')
        
        filtered_logs = audit_logs.copy()
        
        # Apply filters
        if start_date:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            filtered_logs = [log for log in filtered_logs 
                           if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) >= start_dt]
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            filtered_logs = [log for log in filtered_logs 
                           if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) <= end_dt]
        
        if event_type:
            filtered_logs = [log for log in filtered_logs if log['event_type'] == event_type]
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['ID', 'Timestamp', 'Event Type', 'User ID', 'IP Address', 'Severity', 'Details'])
        
        # Write data
        for log in filtered_logs:
            writer.writerow([
                log['id'],
                log['timestamp'],
                log['event_type'],
                log.get('user_id', ''),
                log['ip_address'],
                log['severity'],
                json.dumps(log['details'])
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        return jsonify({
            'success': True,
            'data': {
                'csv_content': csv_content,
                'filename': f'audit_logs_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv',
                'record_count': len(filtered_logs)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Initialize with some sample audit logs
def init_sample_logs():
    """Initialize with sample audit logs"""
    sample_events = [
        ('login', 'USR-001', {'device': 'laptop', 'location': 'Chennai'}, 'info'),
        ('login_failed', 'USR-002', {'reason': 'invalid_password', 'attempts': 3}, 'warning'),
        ('anomaly_detected', 'USR-001', {'type': 'unusual_location', 'location': 'Moscow'}, 'error'),
        ('policy_change', None, {'policy': 'mfa_required', 'value': True}, 'info'),
        ('session_terminated', 'USR-003', {'reason': 'suspicious_activity'}, 'warning')
    ]
    
    for event_type, user_id, details, severity in sample_events:
        log_event(event_type, user_id, details, severity)

# Initialize sample data
init_sample_logs()
#!/usr/bin/env python3
"""
Complete Feature Test Suite for Continuous 2FA System
Tests all 10 enterprise features to verify they're working
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test an API endpoint and return result"""
    try:
        url = f"{BASE_URL}{endpoint}"
        
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=5)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=5)
        
        return {
            'success': response.status_code < 400,
            'status_code': response.status_code,
            'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def print_test_result(feature_name, test_name, result):
    """Print formatted test result"""
    status = "✅ PASS" if result['success'] else "❌ FAIL"
    print(f"  {test_name:<40} {status}")
    if not result['success']:
        print(f"    Error: {result.get('error', result.get('status_code', 'Unknown'))}")

def main():
    print("=" * 80)
    print("CONTINUOUS 2FA SYSTEM - ENTERPRISE FEATURE TEST SUITE")
    print("=" * 80)
    print(f"Testing server at: {BASE_URL}")
    print(f"Test started at: {datetime.now()}")
    print("=" * 80)
    
    # Test 1: Basic System Health
    print("\n🔍 1. SYSTEM HEALTH & BASIC AUTH")
    
    result = test_endpoint('GET', '/api/health')
    print_test_result("System Health", "Health Check", result)
    
    result = test_endpoint('POST', '/api/auth/login', {'username': 'testuser', 'password': 'test123'})
    print_test_result("Authentication", "User Login", result)
    
    result = test_endpoint('POST', '/api/auth/admin-login', {'username': 'admin', 'password': 'admin123'})
    print_test_result("Authentication", "Admin Login", result)
    
    # Test 2: Device Fingerprinting Engine
    print("\n🔍 2. DEVICE FINGERPRINTING ENGINE")
    
    device_data = {
        'user_id': 'USR-001',
        'device_info': {
            'browser': 'Chrome 120',
            'os': 'Windows 11',
            'screen_resolution': '1920x1080',
            'timezone': 'Asia/Kolkata',
            'language': 'en-US'
        },
        'location': {'lat': 13.0827, 'lon': 80.2707}
    }
    
    result = test_endpoint('POST', '/api/device/register', device_data)
    print_test_result("Device Management", "Device Registration", result)
    
    if result['success'] and 'data' in result and 'device_id' in result['data']:
        device_id = result['data']['device_id']
        
        check_data = {
            'device_id': device_id,
            'behavioral_data': {
                'location_consistent': True,
                'time_pattern_normal': True,
                'ip_consistent': True
            }
        }
        
        result = test_endpoint('POST', '/api/device/check', check_data)
        print_test_result("Device Management", "Device Trust Check", result)
        
        result = test_endpoint('GET', f'/api/device/list/USR-001')
        print_test_result("Device Management", "List User Devices", result)
    
    # Test 3: Session Management Module
    print("\n🔍 3. SESSION MANAGEMENT MODULE")
    
    session_data = {
        'user_id': 'USR-001',
        'device_id': 'DEV-123',
        'location': {'city': 'Chennai', 'country': 'India'}
    }
    
    result = test_endpoint('POST', '/api/session/start', session_data)
    print_test_result("Session Management", "Start Session", result)
    
    session_id = None
    if result['success'] and 'data' in result and 'session_id' in result['data']:
        session_id = result['data']['session_id']
        
        update_data = {
            'session_id': session_id,
            'activity_data': {
                'suspicious_activity': False,
                'rapid_requests': False,
                'unusual_patterns': False
            }
        }
        
        result = test_endpoint('POST', '/api/session/update', update_data)
        print_test_result("Session Management", "Update Session Activity", result)
    
    result = test_endpoint('GET', '/api/session/active')
    print_test_result("Session Management", "Get Active Sessions", result)
    
    result = test_endpoint('GET', '/api/session/user/USR-001')
    print_test_result("Session Management", "Get User Sessions", result)
    
    # Test 4: Security Policy Engine
    print("\n🔍 4. SECURITY POLICY ENGINE")
    
    result = test_endpoint('GET', '/api/security/policies')
    print_test_result("Security Policies", "Get Security Policies", result)
    
    policy_update = {
        'policy_key': 'max_failed_attempts',
        'policy_value': 3,
        'admin_id': 'admin'
    }
    
    result = test_endpoint('POST', '/api/security/policy/update', policy_update)
    print_test_result("Security Policies", "Update Security Policy", result)
    
    # Test 5: Threat Intelligence Feed
    print("\n🔍 5. THREAT INTELLIGENCE FEED")
    
    threat_check_data = {
        'ip_address': '203.45.67.89',
        'pattern': {
            'rapid_attempts': True,
            'multiple_devices': False,
            'unusual_time': True
        }
    }
    
    result = test_endpoint('POST', '/api/security/threat-check', threat_check_data)
    print_test_result("Threat Intelligence", "Threat IP Check", result)
    
    # Test 6: Anomaly Detection Engine
    print("\n🔍 6. ANOMALY DETECTION ENGINE")
    
    anomaly_data = {
        'user_id': 'USR-001',
        'behavior_data': {
            'location': {'lat': 55.7558, 'lon': 37.6176},  # Moscow
            'usual_location': {'lat': 13.0827, 'lon': 80.2707},  # Chennai
            'usual_login_hours': [9, 10, 11, 12, 13, 14, 15, 16, 17],
            'device_fingerprint': 'unknown_device_123',
            'known_devices': ['device_1', 'device_2']
        }
    }
    
    result = test_endpoint('POST', '/api/security/anomaly/detect', anomaly_data)
    print_test_result("Anomaly Detection", "Detect Behavioral Anomalies", result)
    
    # Test 7: Security Alerts & Notification System
    print("\n🔍 7. SECURITY ALERTS & NOTIFICATIONS")
    
    result = test_endpoint('GET', '/api/security/alerts')
    print_test_result("Security Alerts", "Get Security Alerts", result)
    
    result = test_endpoint('GET', '/api/security/alerts?severity=high')
    print_test_result("Security Alerts", "Filter High Severity Alerts", result)
    
    # Test 8: Audit Logging & Reporting Backend
    print("\n🔍 8. AUDIT LOGGING & REPORTING")
    
    audit_log_data = {
        'event_type': 'login_attempt',
        'user_id': 'USR-001',
        'details': {
            'ip_address': '192.168.1.100',
            'device': 'laptop',
            'success': True
        },
        'severity': 'info'
    }
    
    result = test_endpoint('POST', '/api/audit/log', audit_log_data)
    print_test_result("Audit Logging", "Create Audit Log", result)
    
    result = test_endpoint('GET', '/api/audit/logs?limit=10')
    print_test_result("Audit Logging", "Get Audit Logs", result)
    
    result = test_endpoint('GET', '/api/audit/reports/daily')
    print_test_result("Audit Reporting", "Generate Daily Report", result)
    
    result = test_endpoint('GET', '/api/audit/reports/weekly')
    print_test_result("Audit Reporting", "Generate Weekly Report", result)
    
    result = test_endpoint('GET', '/api/audit/reports/user-risk')
    print_test_result("Audit Reporting", "Generate User Risk Report", result)
    
    # Test 9: Session Termination
    print("\n🔍 9. SESSION TERMINATION & CONTROL")
    
    if session_id:
        terminate_data = {
            'session_id': session_id,
            'reason': 'security_test'
        }
        
        result = test_endpoint('POST', '/api/session/terminate', terminate_data)
        print_test_result("Session Control", "Terminate Session", result)
    
    # Test 10: Export & CSV Generation
    print("\n🔍 10. DATA EXPORT & CSV GENERATION")
    
    result = test_endpoint('GET', '/api/audit/export/csv?limit=5')
    print_test_result("Data Export", "Export Audit Logs as CSV", result)
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print("✅ All enterprise features have been tested")
    print("📊 Check individual test results above for detailed status")
    print("🔧 If any tests failed, ensure the backend server is running:")
    print("   python backend/app.py")
    print("=" * 80)

if __name__ == "__main__":
    main()
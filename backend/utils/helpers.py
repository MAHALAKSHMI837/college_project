"""
Helper utilities for common operations
"""
import hashlib
import secrets
import bcrypt
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class SecurityHelper:
    """Security-related helper functions"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
        except Exception:
            return False
    
    @staticmethod
    def generate_token() -> str:
        """Generate secure random token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def hash_string(text: str) -> str:
        """Generate SHA-256 hash of string"""
        return hashlib.sha256(text.encode()).hexdigest()

class DateTimeHelper:
    """DateTime helper functions"""
    
    @staticmethod
    def utc_now() -> datetime:
        """Get current UTC datetime"""
        return datetime.now(timezone.utc)
    
    @staticmethod
    def format_datetime(dt: datetime) -> str:
        """Format datetime to ISO string"""
        return dt.isoformat()
    
    @staticmethod
    def parse_datetime(dt_str: str) -> Optional[datetime]:
        """Parse ISO datetime string"""
        try:
            return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        except Exception:
            return None

class ResponseHelper:
    """API response helper functions"""
    
    @staticmethod
    def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
        """Create success response"""
        response = {
            "success": True,
            "message": message,
            "timestamp": DateTimeHelper.format_datetime(DateTimeHelper.utc_now())
        }
        if data is not None:
            response["data"] = data
        return response
    
    @staticmethod
    def error_response(message: str, code: int = 400, details: Any = None) -> Dict[str, Any]:
        """Create error response"""
        response = {
            "success": False,
            "error": message,
            "code": code,
            "timestamp": DateTimeHelper.format_datetime(DateTimeHelper.utc_now())
        }
        if details:
            response["details"] = details
        return response

# Helper instances
security_helper = SecurityHelper()
datetime_helper = DateTimeHelper()
response_helper = ResponseHelper()
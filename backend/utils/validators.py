"""
Input validation utilities
"""
import re
from typing import Dict, Any, Optional

class InputValidator:
    """Validate user inputs and API requests"""
    
    @staticmethod
    def validate_username(username: str) -> bool:
        """Validate username format"""
        if not username or len(username) < 3 or len(username) > 50:
            return False
        return re.match(r'^[a-zA-Z0-9_]+$', username) is not None
    
    @staticmethod
    def validate_password(password: str) -> bool:
        """Validate password strength"""
        if not password or len(password) < 6:
            return False
        return True
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email:
            return True  # Email is optional
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_trust_score(score: float) -> bool:
        """Validate trust score range"""
        return 0.0 <= score <= 1.0
    
    @staticmethod
    def validate_user_id(user_id: Any) -> bool:
        """Validate user ID"""
        try:
            return isinstance(user_id, int) and user_id > 0
        except (ValueError, TypeError):
            return False

validator = InputValidator()
"""
Authentication middleware
"""
from flask import g, request, jsonify
import jwt
from datetime import datetime, timezone
from config import Config

class AuthMiddleware:
    """Authentication middleware class"""
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify JWT token and return payload"""
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = jwt.decode(
                token, 
                Config.SECRET_KEY, 
                algorithms=['HS256']
            )
            
            # Check expiration
            if payload.get('exp', 0) < datetime.now(timezone.utc).timestamp():
                raise jwt.ExpiredSignatureError()
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
    
    @staticmethod
    def get_current_user():
        """Get current authenticated user from context"""
        return {
            'user_id': getattr(g, 'user_id', None),
            'username': getattr(g, 'username', None)
        }
    
    @staticmethod
    def is_authenticated() -> bool:
        """Check if current request is authenticated"""
        return hasattr(g, 'user_id') and g.user_id is not None
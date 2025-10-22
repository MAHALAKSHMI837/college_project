from utils.database import db_manager
from utils.helpers import security_helper
from typing import Optional, List, Dict, Any

class UserModel:
    """User model for database operations"""
    
    @staticmethod
    def create_user(username: str, password: str, email: Optional[str] = None, device: str = "Unknown") -> Optional[int]:
        """Create a new user with hashed password"""
        try:
            password_hash = security_helper.hash_password(password)
            
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (username, password_hash, email, device) VALUES (%s, %s, %s, %s) RETURNING id",
                    (username, password_hash, email, device)
                )
                user_id = cursor.fetchone()[0]
                conn.commit()
                return user_id
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    @staticmethod
    def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
        """Get user by username"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, username, password_hash, email, device, created_at FROM users WHERE username = %s",
                    (username,)
                )
                row = cursor.fetchone()
                if row:
                    return {
                        'id': row[0],
                        'username': row[1],
                        'password_hash': row[2],
                        'email': row[3],
                        'device': row[4],
                        'created_at': row[5]
                    }
                return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    @staticmethod
    def verify_password(username: str, password: str) -> Optional[Dict[str, Any]]:
        """Verify user password and return user data"""
        user = UserModel.get_user_by_username(username)
        if user:
            # Check if password is already hashed (starts with $2b$)
            if user['password_hash'].startswith('$2b$'):
                # Use bcrypt verification
                if security_helper.verify_password(password, user['password_hash']):
                    return user
            else:
                # Plain text comparison for existing users
                if password == user['password_hash']:
                    return user
        return None
    
    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, username, email, device, created_at FROM users WHERE id = %s",
                    (user_id,)
                )
                row = cursor.fetchone()
                if row:
                    return {
                        'id': row[0],
                        'username': row[1],
                        'email': row[2],
                        'device': row[3],
                        'created_at': row[4]
                    }
                return None
        except Exception as e:
            print(f"Error getting user by ID: {e}")
            return None
    
    @staticmethod
    def update_user_device(user_id: int, device: str) -> bool:
        """Update user's device information"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE users SET device = %s WHERE id = %s",
                    (device, user_id)
                )
                conn.commit()
                return True
        except Exception as e:
            print(f"Error updating user device: {e}")
            return False
    
    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        """Get all users for admin"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, username, email, device, created_at FROM users ORDER BY created_at DESC"
                )
                rows = cursor.fetchall()
                return [
                    {
                        'id': row[0],
                        'username': row[1],
                        'email': row[2],
                        'device': row[3],
                        'created_at': row[4]
                    }
                    for row in rows
                ]
        except Exception as e:
            print(f"Error getting all users: {e}")
            return []
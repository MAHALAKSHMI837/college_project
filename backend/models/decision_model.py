from utils.database import db_manager
from utils.helpers import datetime_helper
from typing import Optional, List, Dict, Any

class DecisionModel:
    """Decision model for authentication decisions"""
    
    @staticmethod
    def create_decision(user_id: int, trust_score: float, result: str, note: str = "") -> Optional[int]:
        """Create a new authentication decision"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO decisions (user_id, trust_score, result, note) VALUES (%s, %s, %s, %s) RETURNING id",
                    (user_id, trust_score, result, note)
                )
                decision_id = cursor.fetchone()[0]
                conn.commit()
                return decision_id
        except Exception as e:
            print(f"Error creating decision: {e}")
            return None
    
    @staticmethod
    def get_decisions_by_user(user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent decisions for a user"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, trust_score, result, note, created_at FROM decisions WHERE user_id = %s ORDER BY created_at DESC LIMIT %s",
                    (user_id, limit)
                )
                rows = cursor.fetchall()
                return [
                    {
                        'id': row[0],
                        'trust_score': row[1],
                        'result': row[2],
                        'note': row[3],
                        'created_at': row[4]
                    }
                    for row in rows
                ]
        except Exception as e:
            print(f"Error getting user decisions: {e}")
            return []
    
    @staticmethod
    def get_all_decisions(limit: int = 100) -> List[Dict[str, Any]]:
        """Get all decisions for admin"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    SELECT d.id, u.username, d.trust_score, d.result, d.note, d.created_at 
                    FROM decisions d 
                    JOIN users u ON d.user_id = u.id 
                    ORDER BY d.created_at DESC 
                    LIMIT %s
                    """,
                    (limit,)
                )
                rows = cursor.fetchall()
                return [
                    {
                        'id': row[0],
                        'username': row[1],
                        'trust_score': row[2],
                        'result': row[3],
                        'note': row[4],
                        'created_at': row[5]
                    }
                    for row in rows
                ]
        except Exception as e:
            print(f"Error getting all decisions: {e}")
            return []
    
    @staticmethod
    def get_decision_stats() -> Dict[str, Any]:
        """Get decision statistics"""
        try:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                
                # Total decisions
                cursor.execute("SELECT COUNT(*) FROM decisions")
                total_decisions = cursor.fetchone()[0]
                
                # Decision breakdown
                cursor.execute("SELECT result, COUNT(*) FROM decisions GROUP BY result")
                breakdown = {row[0]: row[1] for row in cursor.fetchall()}
                
                # Average trust score
                cursor.execute("SELECT AVG(trust_score) FROM decisions")
                avg_trust = cursor.fetchone()[0] or 0
                
                return {
                    'total_decisions': total_decisions,
                    'decision_breakdown': breakdown,
                    'average_trust_score': round(avg_trust, 3)
                }
        except Exception as e:
            print(f"Error getting decision stats: {e}")
            return {
                'total_decisions': 0,
                'decision_breakdown': {},
                'average_trust_score': 0.0
            }
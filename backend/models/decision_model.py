
from backend.services.utils.db import get_db

def save_decision(user_id, trust, result, note=""):
    """
    Save an authentication decision to the database
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return False
    
    cur = conn.cursor()
    try:
        # Try with 'trust' column first (most common)
        try:
            cur.execute(
                "INSERT INTO decisions (user_id, trust, result, note) VALUES (%s, %s, %s, %s)",
                (user_id, trust, result, note)
            )
            conn.commit()
            print(f"✅ Decision saved with 'trust' column: User {user_id}, Trust: {trust}, Result: {result}")
            return True
        except Exception as e:
            conn.rollback()
            print(f"⚠️  'trust' column failed, trying 'trust_score': {e}")
            
            # Try with 'trust_score' column
            try:
                cur.execute(
                    "INSERT INTO decisions (user_id, trust_score, result, note) VALUES (%s, %s, %s, %s)",
                    (user_id, trust, result, note)
                )
                conn.commit()
                print(f"✅ Decision saved with 'trust_score' column: User {user_id}, Trust: {trust}, Result: {result}")
                return True
            except Exception as e2:
                conn.rollback()
                print(f"❌ Both column attempts failed: {e2}")
                return False
                
    except Exception as e:
        print(f"❌ Error saving decision: {e}")
        conn.rollback()
        return False
    finally:
        cur.close()
        conn.close()

def get_user_decisions(user_id):
    """
    Get recent decisions for a specific user
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return []
    
    cur = conn.cursor()
    try:
        # Try with 'trust' and 'created_at' columns first
        try:
            cur.execute(
                "SELECT id, trust, result, note, created_at FROM decisions WHERE user_id=%s ORDER BY created_at DESC LIMIT 20",
                (user_id,)
            )
        except Exception as e:
            print(f"⚠️  First query failed, trying alternatives: {e}")
            # Try with 'trust_score' and 'timestamp'
            try:
                cur.execute(
                    "SELECT id, trust_score, result, note, timestamp FROM decisions WHERE user_id=%s ORDER BY timestamp DESC LIMIT 20",
                    (user_id,)
                )
            except Exception as e2:
                print(f"❌ All query attempts failed: {e2}")
                return []
        
        rows = cur.fetchall()
        decisions = []
        for row in rows:
            # Safely handle NULL trust values
            trust_value = row[1]
            if trust_value is None:
                trust_value = 0.0  # Default value for NULL
            else:
                try:
                    trust_value = float(trust_value)
                except (ValueError, TypeError):
                    trust_value = 0.0  # Default for invalid values
            
            decisions.append({
                "id": row[0],
                "trust": trust_value,
                "result": row[2] or "UNKNOWN",
                "note": row[3] or "",
                "timestamp": row[4]
            })
        print(f"✅ Retrieved {len(decisions)} decisions for user {user_id}")
        return decisions
        
    except Exception as e:
        print(f"❌ Error retrieving decisions: {e}")
        return []
    finally:
        cur.close()
        conn.close()

def get_all_decisions(limit=50):
    """
    Get all recent decisions across all users
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return []
    
    cur = conn.cursor()
    try:
        # Try first combination
        try:
            cur.execute("""
                SELECT d.id, u.id as user_id, u.username, d.trust, d.result, d.note, d.created_at
                FROM decisions d
                JOIN users u ON d.user_id = u.id
                ORDER BY d.created_at DESC
                LIMIT %s
            """, (limit,))
        except Exception as e:
            print(f"⚠️  First query failed: {e}")
            # Try alternative column names
            try:
                cur.execute("""
                    SELECT d.id, u.id as user_id, u.username, d.trust_score, d.result, d.note, d.timestamp
                    FROM decisions d
                    JOIN users u ON d.user_id = u.id
                    ORDER BY d.timestamp DESC
                    LIMIT %s
                """, (limit,))
            except Exception as e2:
                print(f"❌ All query attempts failed: {e2}")
                return []
        
        rows = cur.fetchall()
        decisions = []
        for row in rows:
            # Safely handle NULL trust values
            trust_value = row[3]
            if trust_value is None:
                trust_value = 0.0  # Default value for NULL
            else:
                try:
                    trust_value = float(trust_value)
                except (ValueError, TypeError):
                    trust_value = 0.0  # Default for invalid values
            
            decisions.append({
                "id": row[0],
                "user_id": row[1],
                "username": row[2] or "Unknown",
                "trust": trust_value,
                "result": row[4] or "UNKNOWN",
                "note": row[5] or "",
                "timestamp": row[6]
            })
        print(f"✅ Retrieved {len(decisions)} decisions")
        return decisions
        
    except Exception as e:
        print(f"❌ Error retrieving all decisions: {e}")
        return []
    finally:
        cur.close()
        conn.close()

def get_decision_stats(user_id=None):
    """
    Get statistics about decisions
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return {}
    
    cur = conn.cursor()
    try:
        where_clause = "WHERE user_id = %s" if user_id else ""
        params = (user_id,) if user_id else ()
        
        # Try with 'trust' column first
        try:
            query = f"""
                SELECT 
                    COUNT(*) as total_decisions,
                    AVG(trust) as avg_trust,
                    SUM(CASE WHEN result = 'ALLOW' THEN 1 ELSE 0 END) as allow_count,
                    SUM(CASE WHEN result = 'CHALLENGE' THEN 1 ELSE 0 END) as challenge_count,
                    SUM(CASE WHEN result = 'BLOCK' THEN 1 ELSE 0 END) as block_count
                FROM decisions 
                {where_clause}
            """
            cur.execute(query, params)
        except Exception as e:
            print(f"⚠️  'trust' column failed, trying 'trust_score': {e}")
            # Try with 'trust_score' column
            try:
                query = f"""
                    SELECT 
                        COUNT(*) as total_decisions,
                        AVG(trust_score) as avg_trust,
                        SUM(CASE WHEN result = 'ALLOW' THEN 1 ELSE 0 END) as allow_count,
                        SUM(CASE WHEN result = 'CHALLENGE' THEN 1 ELSE 0 END) as challenge_count,
                        SUM(CASE WHEN result = 'BLOCK' THEN 1 ELSE 0 END) as block_count
                    FROM decisions 
                    {where_clause}
                """
                cur.execute(query, params)
            except Exception as e2:
                print(f"❌ Both column attempts failed: {e2}")
                return {
                    "total_decisions": 0,
                    "avg_trust": 0.0,
                    "allow_count": 0,
                    "challenge_count": 0,
                    "block_count": 0
                }
        
        row = cur.fetchone()
        
        if row and row[0] is not None:
            # Safely handle NULL average trust
            avg_trust = row[1] if row[1] is not None else 0.0
            
            stats = {
                "total_decisions": row[0] or 0,
                "avg_trust": round(float(avg_trust), 2),
                "allow_count": row[2] or 0,
                "challenge_count": row[3] or 0,
                "block_count": row[4] or 0
            }
            print(f"✅ Retrieved decision statistics: {stats}")
            return stats
        else:
            return {
                "total_decisions": 0,
                "avg_trust": 0.0,
                "allow_count": 0,
                "challenge_count": 0,
                "block_count": 0
            }
        
    except Exception as e:
        print(f"❌ Error retrieving decision stats: {e}")
        return {
            "total_decisions": 0,
            "avg_trust": 0.0,
            "allow_count": 0,
            "challenge_count": 0,
            "block_count": 0
        }
    finally:
        cur.close()
        conn.close()

# Debug function to check for NULL values
def debug_null_trust_values():
    """Check for NULL trust values in the database"""
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return
    
    cur = conn.cursor()
    try:
        # Check for NULL trust values
        cur.execute("""
            SELECT COUNT(*) as total_decisions,
                   COUNT(trust) as non_null_trust,
                   COUNT(*) - COUNT(trust) as null_trust
            FROM decisions
        """)
        stats = cur.fetchone()
        print(f"📊 Trust value stats: Total={stats[0]}, Non-NULL={stats[1]}, NULL={stats[2]}")   # type: ignore
        
        # Show some examples of NULL trust values
        if stats[2] > 0:  # type: ignore
            cur.execute("SELECT id, user_id, result, note FROM decisions WHERE trust IS NULL LIMIT 5")
            null_rows = cur.fetchall()
            print("📝 Sample NULL trust decisions:")
            for row in null_rows:
                print(f"  - ID: {row[0]}, User: {row[1]}, Result: {row[2]}, Note: {row[3]}")
                
    except Exception as e:
        print(f"❌ Error checking NULL values: {e}")
    finally:
        cur.close()
        conn.close()

# Uncomment to debug NULL values when the module loads
debug_null_trust_values()
import psycopg2
from psycopg2 import pool
import logging
from contextlib import contextmanager
from config import Config

logger = logging.getLogger(__name__)

class DatabaseManager:
    _instance = None
    _connection_pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Skip database connection for now
        logger.info("Database manager initialized (no connection)")
    
    def _create_pool(self):
        """Create connection pool for better performance"""
        try:
            self._connection_pool = psycopg2.pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=20,
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                database=Config.DB_NAME,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD
            )
            logger.info("Database connection pool created")
        except Exception as e:
            logger.error(f"Failed to create connection pool: {e}")
            # Don't raise, just continue without database
            self._connection_pool = None
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        if self._connection_pool is None:
            # Return a mock connection that does nothing
            yield None
            return
            
        conn = None
        try:
            conn = self._connection_pool.getconn()
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                self._connection_pool.putconn(conn)

# Singleton instance
db_manager = DatabaseManager()
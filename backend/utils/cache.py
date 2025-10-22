import time
from typing import Any, Optional

class SimpleCache:
    """Simple in-memory cache for frequently accessed data"""
    
    def __init__(self, default_ttl: int = 300):  # 5 minutes default
        self._cache = {}
        self._timestamps = {}
        self.default_ttl = default_ttl
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key not in self._cache:
            return None
        
        if self._is_expired(key):
            self.delete(key)
            return None
        
        return self._cache[key]
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        self._cache[key] = value
        self._timestamps[key] = time.time() + (ttl or self.default_ttl)
    
    def delete(self, key: str) -> None:
        """Delete key from cache"""
        self._cache.pop(key, None)
        self._timestamps.pop(key, None)
    
    def _is_expired(self, key: str) -> bool:
        """Check if cache entry is expired"""
        return time.time() > self._timestamps.get(key, 0)
    
    def clear(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()
        self._timestamps.clear()

# Global cache instance
cache = SimpleCache()
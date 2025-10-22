"""
Unified trust calculator combining all behavioral analysis
"""
import random
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from config import Config

class UnifiedTrustCalculator:
    """Unified trust calculator with all behavioral factors"""
    
    def __init__(self):
        self.wifi_enabled = getattr(Config, 'WIFI_SCANNER_ENABLED', False)
        self.audio_enabled = getattr(Config, 'AUDIO_ANALYZER_ENABLED', False)
        self.smartwatch_enabled = getattr(Config, 'SMARTWATCH_INTEGRATION', False)
        self.user_history = {}
        
    def calculate_trust_score(self, user_id: int, behavioral_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Calculate comprehensive trust score"""
        if not behavioral_data:
            behavioral_data = {}
            
        trust_components = {}
        base_score = 0.5
        
        # Wi-Fi Analysis (30% weight)
        if self.wifi_enabled and 'wifi_rssi' in behavioral_data:
            wifi_score = self._analyze_wifi_patterns(behavioral_data['wifi_rssi'])
            trust_components['wifi'] = wifi_score
            base_score += wifi_score * 0.3
        
        # Audio Analysis (25% weight)
        if self.audio_enabled and 'audio_entropy' in behavioral_data:
            audio_score = self._analyze_audio_entropy(behavioral_data['audio_entropy'])
            trust_components['audio'] = audio_score
            base_score += audio_score * 0.25
            
        # Smartwatch Integration (25% weight)
        if self.smartwatch_enabled and 'watch_proximity' in behavioral_data:
            watch_score = self._analyze_smartwatch_data(behavioral_data['watch_proximity'])
            trust_components['smartwatch'] = watch_score
            base_score += watch_score * 0.25
            
        # Behavioral Patterns (20% weight)
        behavior_score = self._analyze_behavioral_patterns(user_id, behavioral_data)
        trust_components['behavior'] = behavior_score
        base_score += behavior_score * 0.2
        
        # Normalize and clamp score
        final_score = max(0.1, min(0.99, base_score))
        
        # Update user history
        self._update_user_history(user_id, final_score)
        
        # Determine decision
        decision_data = self._make_decision(final_score)
        
        return {
            'trust_score': round(final_score, 3),
            'decision': decision_data['decision'],
            'note': decision_data['note'],
            'confidence': self._calculate_confidence(final_score),
            'components': trust_components,
            'services_active': {
                'wifi': self.wifi_enabled,
                'audio': self.audio_enabled,
                'smartwatch': self.smartwatch_enabled
            },
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    
    def _analyze_wifi_patterns(self, rssi_values: List[float]) -> float:
        """Analyze Wi-Fi RSSI pattern stability"""
        if not rssi_values or len(rssi_values) < 2:
            return 0.5
        
        # Calculate variance for stability
        mean_rssi = sum(rssi_values) / len(rssi_values)
        variance = sum((x - mean_rssi) ** 2 for x in rssi_values) / len(rssi_values)
        
        # Lower variance = higher stability = higher trust
        stability = max(0, 1 - (variance / 100))
        
        # Add some realistic variation
        return min(1.0, stability + random.uniform(-0.05, 0.05))
    
    def _analyze_audio_entropy(self, entropy: float) -> float:
        """Analyze ambient audio entropy for environment consistency"""
        if entropy == 0:
            return 0.5
        
        # Normal office/home entropy range: 0.3-0.8
        if 0.3 <= entropy <= 0.8:
            return 0.8 + random.uniform(-0.1, 0.1)
        elif 0.2 <= entropy <= 0.9:
            return 0.6 + random.uniform(-0.1, 0.1)
        else:
            return 0.4 + random.uniform(-0.1, 0.1)
    
    def _analyze_smartwatch_data(self, proximity: float) -> float:
        """Analyze smartwatch proximity and biometric data"""
        if proximity == 0:
            return 0.3  # No device detected
        
        # Proximity-based trust (closer = higher trust)
        if proximity >= 0.8:
            return 0.9 + random.uniform(-0.05, 0.05)
        elif proximity >= 0.6:
            return 0.7 + random.uniform(-0.1, 0.1)
        elif proximity >= 0.4:
            return 0.5 + random.uniform(-0.1, 0.1)
        else:
            return 0.3 + random.uniform(-0.05, 0.05)
    
    def _analyze_behavioral_patterns(self, user_id: int, data: Dict[str, Any]) -> float:
        """Analyze general behavioral patterns"""
        base_score = 0.6
        
        # Typing pattern consistency
        if data.get('typing_consistent', True):
            base_score += 0.1
        
        # Mouse movement patterns
        if data.get('mouse_consistent', True):
            base_score += 0.1
        
        # Session context (time, location, etc.)
        if data.get('context_normal', True):
            base_score += 0.1
        
        # Historical consistency
        if user_id in self.user_history:
            history = self.user_history[user_id]
            if len(history) >= 3:
                recent_avg = sum(history[-3:]) / 3
                if abs(base_score - recent_avg) < 0.2:  # Consistent with recent behavior
                    base_score += 0.05
        
        return min(1.0, base_score + random.uniform(-0.05, 0.05))
    
    def _make_decision(self, trust_score: float) -> Dict[str, str]:
        """Make authentication decision based on trust score"""
        if trust_score >= 0.7:
            return {
                'decision': 'ALLOW',
                'note': 'High trust score - access granted'
            }
        elif trust_score >= 0.4:
            return {
                'decision': 'CHALLENGE',
                'note': 'Medium trust score - additional verification required'
            }
        else:
            return {
                'decision': 'BLOCK',
                'note': 'Low trust score - access denied'
            }
    
    def _calculate_confidence(self, score: float) -> str:
        """Calculate confidence level"""
        if score >= 0.85:
            return 'very_high'
        elif score >= 0.7:
            return 'high'
        elif score >= 0.5:
            return 'medium'
        elif score >= 0.3:
            return 'low'
        else:
            return 'very_low'
    
    def _update_user_history(self, user_id: int, score: float):
        """Update user's trust score history"""
        if user_id not in self.user_history:
            self.user_history[user_id] = []
        
        self.user_history[user_id].append(score)
        
        # Keep only last 20 scores
        if len(self.user_history[user_id]) > 20:
            self.user_history[user_id] = self.user_history[user_id][-20:]
    
    def get_user_trust_trend(self, user_id: int) -> List[float]:
        """Get user's recent trust score trend"""
        return self.user_history.get(user_id, [])

# Global instance
trust_calculator = UnifiedTrustCalculator()
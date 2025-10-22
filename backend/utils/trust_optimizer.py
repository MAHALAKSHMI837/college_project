import numpy as np
from typing import Dict, Any

class TrustOptimizer:
    """Optimized trust score calculation with adaptive thresholds"""
    
    def __init__(self):
        self.thresholds = {
            'allow': 0.75,    # Increased for better security
            'challenge': 0.45, # Lowered to reduce false positives
            'block': 0.0
        }
    
    def calculate_optimized_score(self, behavioral_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate optimized trust score with contextual adjustments"""
        
        # Base calculation
        base_score = 0.7
        
        # Behavioral adjustments
        if behavioral_data.get('typing_consistent', True):
            base_score += 0.1
        if behavioral_data.get('location_familiar', True):
            base_score += 0.1
        if behavioral_data.get('time_normal', True):
            base_score += 0.05
        
        # Risk factors
        if behavioral_data.get('new_device', False):
            base_score -= 0.2
        if behavioral_data.get('unusual_pattern', False):
            base_score -= 0.15
        
        # Clamp score
        trust_score = max(0.1, min(0.99, base_score))
        
        # Determine action
        if trust_score >= self.thresholds['allow']:
            decision = "ALLOW"
            note = "High confidence - access granted"
        elif trust_score >= self.thresholds['challenge']:
            decision = "CHALLENGE"
            note = "Medium confidence - additional verification required"
        else:
            decision = "BLOCK"
            note = "Low confidence - access denied"
        
        return {
            'trust_score': round(trust_score, 3),
            'decision': decision,
            'note': note,
            'confidence': self._get_confidence(trust_score)
        }
    
    def _get_confidence(self, score: float) -> str:
        """Get confidence level"""
        if score >= 0.8:
            return 'very_high'
        elif score >= 0.65:
            return 'high'
        elif score >= 0.45:
            return 'medium'
        elif score >= 0.25:
            return 'low'
        else:
            return 'very_low'

trust_optimizer = TrustOptimizer()
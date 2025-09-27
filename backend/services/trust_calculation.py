import numpy as np
import logging

logger = logging.getLogger(__name__)

class TrustCalculator:
    def calculate_trust_score(self, behavioral_data, user_baseline):
        # ADD THIS DEBUG LOGGING AT THE BEGINNING OF THE FUNCTION
        logger.info(f"Behavioral data received: {behavioral_data}")
        logger.info(f"User baseline: {user_baseline}")
        
        # Add validation
        if not behavioral_data:
            logger.warning("No behavioral data provided")
            return 0.5
        
        try:
            # Calculate individual metrics with safe defaults
            typing_metrics = behavioral_data.get('typing_metrics', {})
            mouse_metrics = behavioral_data.get('mouse_metrics', {})
            context_data = behavioral_data.get('context', {})
            
            typing_similarity = self._calculate_typing_similarity(
                typing_metrics,
                user_baseline.get('typing_baseline', {}) if user_baseline else {}
            )
            
            mouse_similarity = self._calculate_mouse_similarity(
                mouse_metrics,
                user_baseline.get('mouse_baseline', {}) if user_baseline else {}
            )
            
            context_risk = self._calculate_context_risk(context_data)
            
            # Weighted average
            trust_score = (
                typing_similarity * 0.4 +
                mouse_similarity * 0.4 +
                context_risk * 0.2
            )
            
            return max(0.0, min(1.0, trust_score))  # Clamp between 0-1
            
        except Exception as e:
            logger.error(f"Trust calculation error: {e}")
            return 0.5  # Fallback score
    
    def _calculate_typing_similarity(self, current_typing, baseline_typing):
        # Add your typing similarity calculation here
        return 0.7  # Default for testing
    
    def _calculate_mouse_similarity(self, current_mouse, baseline_mouse):
        # Add your mouse similarity calculation here
        return 0.8  # Default for testing
    
    def _calculate_context_risk(self, context_data):
        # Add your context risk calculation here
        return 0.9  # Default for testing
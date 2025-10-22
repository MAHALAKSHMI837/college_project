import unittest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.realtime_trust import RealTimeTrustCalculator

class TestTrustCalculator(unittest.TestCase):
    def setUp(self):
        self.calculator = RealTimeTrustCalculator()
    
    def test_basic_trust_calculation(self):
        behavioral_data = {
            'wifi_rssi': [-45, -47, -46, -45],
            'audio_entropy': 0.5,
            'device_proximity': 0.8
        }
        
        result = self.calculator.calculate_trust_score(1, behavioral_data)
        
        self.assertIn('trust_score', result)
        self.assertIn('components', result)
        self.assertIn('confidence', result)
        self.assertGreaterEqual(result['trust_score'], 0.1)
        self.assertLessEqual(result['trust_score'], 0.99)
    
    def test_wifi_pattern_analysis(self):
        # Stable RSSI pattern
        stable_rssi = [-45, -45, -46, -45, -45]
        stable_score = self.calculator._analyze_wifi_pattern(stable_rssi)
        
        # Unstable RSSI pattern
        unstable_rssi = [-30, -60, -40, -70, -35]
        unstable_score = self.calculator._analyze_wifi_pattern(unstable_rssi)
        
        self.assertGreater(stable_score, unstable_score)
    
    def test_audio_entropy_analysis(self):
        # Normal office entropy
        normal_entropy = 0.5
        normal_score = self.calculator._analyze_audio_entropy(normal_entropy)
        
        # Abnormal entropy
        abnormal_entropy = 1.2
        abnormal_score = self.calculator._analyze_audio_entropy(abnormal_entropy)
        
        self.assertGreater(normal_score, abnormal_score)
    
    def test_device_proximity_analysis(self):
        # Close proximity
        close_proximity = 0.9
        close_score = self.calculator._analyze_device_proximity(close_proximity)
        
        # No device
        no_device = 0.0
        no_device_score = self.calculator._analyze_device_proximity(no_device)
        
        self.assertGreater(close_score, no_device_score)
    
    def test_trust_history_update(self):
        user_id = 1
        initial_history_length = len(self.calculator.trust_history.get(user_id, []))
        
        self.calculator._update_trust_history(user_id, 0.75)
        
        updated_history_length = len(self.calculator.trust_history[user_id])
        self.assertEqual(updated_history_length, initial_history_length + 1)
    
    def test_confidence_calculation(self):
        self.assertEqual(self.calculator._calculate_confidence(0.85), 'very_high')
        self.assertEqual(self.calculator._calculate_confidence(0.75), 'high')
        self.assertEqual(self.calculator._calculate_confidence(0.55), 'medium')
        self.assertEqual(self.calculator._calculate_confidence(0.35), 'low')
        self.assertEqual(self.calculator._calculate_confidence(0.15), 'very_low')

if __name__ == '__main__':
    unittest.main()
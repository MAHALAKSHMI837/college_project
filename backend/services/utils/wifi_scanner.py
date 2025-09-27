# import random

# # Simulate WiFi RSSI readings
# def get_wifi_rssi():
#     base = -60 + random.uniform(-3,3)
#     return [round(base + random.uniform(-6,6),1) for _ in range(5)]

import subprocess
import json
import platform
import time
import threading
from datetime import datetime

class WiFiScanner:
    def __init__(self, scan_interval=30):
        """
        Initialize WiFi Scanner
        
        Args:
            scan_interval (int): Time between scans in seconds
        """
        self.scan_interval = scan_interval
        self.current_aps = []
        self.scan_history = []
        self.is_scanning = False
        self.scan_thread = None
        
        # Check if we're on a supported platform
        self.system = platform.system()
        if self.system not in ['Windows', 'Linux', 'Darwin']:
            raise NotImplementedError(f"WiFi scanning not supported on {self.system}")
    
    def scan_windows(self):
        """Scan WiFi on Windows using netsh"""
        try:
            result = subprocess.run(
                ['netsh', 'wlan', 'show', 'networks', 'mode=bssid'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode != 0:
                return []
            
            aps = []
            lines = result.stdout.split('\n')
            current_ap = {}
            
            for line in lines:
                line = line.strip()
                if 'SSID' in line and 'BSSID' not in line:
                    if current_ap:
                        aps.append(current_ap)
                        current_ap = {}
                    current_ap['ssid'] = line.split(':')[1].strip()
                elif 'BSSID' in line:
                    current_ap['bssid'] = line.split(':')[1].strip()
                elif 'Signal' in line:
                    signal_str = line.split(':')[1].strip().replace('%', '')
                    current_ap['signal'] = int(signal_str)
                elif 'Channel' in line:
                    current_ap['channel'] = int(line.split(':')[1].strip())
            
            if current_ap:
                aps.append(current_ap)
                
            return aps
            
        except Exception as e:
            print(f"Windows scan error: {e}")
            return []
    
    def scan_linux(self):
        """Scan WiFi on Linux using iwlist"""
        try:
            result = subprocess.run(
                ['sudo', 'iwlist', 'scan'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode != 0:
                # Try without sudo
                result = subprocess.run(
                    ['iwlist', 'scan'],
                    capture_output=True, text=True, timeout=30
                )
                if result.returncode != 0:
                    return []
            
            aps = []
            lines = result.stdout.split('\n')
            current_ap = {}
            
            for line in lines:
                line = line.strip()
                if 'ESSID:' in line:
                    if current_ap:
                        aps.append(current_ap)
                        current_ap = {}
                    current_ap['ssid'] = line.split('"')[1]
                elif 'Address:' in line:
                    current_ap['bssid'] = line.split(' ')[-1]
                elif 'Signal level=' in line:
                    signal_str = line.split('=')[1].split(' ')[0]
                    current_ap['signal'] = int(signal_str)
                elif 'Channel:' in line:
                    current_ap['channel'] = int(line.split(':')[1])
            
            if current_ap:
                aps.append(current_ap)
                
            return aps
            
        except Exception as e:
            print(f"Linux scan error: {e}")
            return []
    
    def scan_macos(self):
        """Scan WiFi on macOS using airport utility"""
        try:
            result = subprocess.run(
                ['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-s'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode != 0:
                return []
            
            aps = []
            lines = result.stdout.split('\n')[1:]  # Skip header
            
            for line in lines:
                if not line.strip():
                    continue
                    
                parts = line.split()
                if len(parts) >= 4:
                    ap = {
                        'ssid': ' '.join(parts[:-3]),  # SSID might have spaces
                        'bssid': parts[-3],
                        'signal': int(parts[-2].replace('dBm', '')),
                        'channel': int(parts[-1].split(',')[0])
                    }
                    aps.append(ap)
            
            return aps
            
        except Exception as e:
            print(f"macOS scan error: {e}")
            return []
    
    def scan(self):
        """Perform a single WiFi scan"""
        print(f"🔍 Scanning WiFi networks...")
        
        if self.system == 'Windows':
            aps = self.scan_windows()
        elif self.system == 'Linux':
            aps = self.scan_linux()
        elif self.system == 'Darwin':  # macOS
            aps = self.scan_macos()
        else:
            aps = []
        
        # Add timestamp and filter valid APs
        valid_aps = []
        for ap in aps:
            if all(key in ap for key in ['ssid', 'bssid', 'signal']):
                ap['timestamp'] = datetime.now().isoformat()
                valid_aps.append(ap)
        
        # Sort by signal strength (strongest first)
        valid_aps.sort(key=lambda x: x['signal'], reverse=True)
        
        # Keep only top 10 APs
        self.current_aps = valid_aps[:10]
        
        # Add to history
        self.scan_history.append({
            'timestamp': datetime.now().isoformat(),
            'access_points': self.current_aps.copy()
        })
        
        # Keep only last 50 scans
        if len(self.scan_history) > 50:
            self.scan_history = self.scan_history[-50:]
        
        print(f"✅ Found {len(self.current_aps)} access points")
        return self.current_aps
    
    def calculate_stability_score(self, history_minutes=5):
        """
        Calculate WiFi stability score based on recent scan history
        
        Args:
            history_minutes (int): How far back to look for stability calculation
            
        Returns:
            float: Stability score between 0 and 1
        """
        if not self.scan_history:
            return 0.5  # Default neutral score
        
        # Filter scans from the specified time window
        cutoff_time = datetime.now().timestamp() - (history_minutes * 60)
        recent_scans = [
            scan for scan in self.scan_history 
            if datetime.fromisoformat(scan['timestamp']).timestamp() > cutoff_time
        ]
        
        if len(recent_scans) < 2:
            return 0.5  # Not enough data
        
        # Calculate signal stability for each AP
        ap_stabilities = {}
        
        for scan in recent_scans:
            for ap in scan['access_points']:
                bssid = ap['bssid']
                if bssid not in ap_stabilities:
                    ap_stabilities[bssid] = {
                        'ssid': ap['ssid'],
                        'signals': [],
                        'first_seen': scan['timestamp']
                    }
                ap_stabilities[bssid]['signals'].append(ap['signal'])
        
        # Calculate variance for each AP
        stability_scores = []
        for bssid, data in ap_stabilities.items():
            signals = data['signals']
            if len(signals) > 1:
                mean_signal = sum(signals) / len(signals)
                variance = sum((s - mean_signal) ** 2 for s in signals) / len(signals)
                # Convert variance to stability score (lower variance = higher stability)
                stability = max(0, 1 - (variance / 1000))  # Normalize
                stability_scores.append(stability)
        
        if not stability_scores:
            return 0.5
        
        # Return average stability score
        avg_stability = sum(stability_scores) / len(stability_scores)
        return min(1.0, max(0.0, avg_stability))
    
    def get_network_fingerprint(self):
        """
        Generate a unique fingerprint based on nearby networks
        
        Returns:
            str: SHA256 hash of sorted BSSIDs and signal strengths
        """
        import hashlib
        
        if not self.current_aps:
            return ""
        
        # Create fingerprint string
        fingerprint_data = '|'.join(
            f"{ap['bssid']}:{ap['signal']}" 
            for ap in sorted(self.current_aps, key=lambda x: x['bssid'])
        )
        
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]
    
    def start_continuous_scan(self):
        """Start continuous scanning in a separate thread"""
        if self.is_scanning:
            return
        
        self.is_scanning = True
        
        def scan_loop():
            while self.is_scanning:
                self.scan()
                time.sleep(self.scan_interval)
        
        self.scan_thread = threading.Thread(target=scan_loop, daemon=True)
        self.scan_thread.start()
        print(f"🚀 Started continuous WiFi scanning (interval: {self.scan_interval}s)")
    
    def stop_continuous_scan(self):
        """Stop continuous scanning"""
        self.is_scanning = False
        if self.scan_thread:
            self.scan_thread.join(timeout=5)
        print("⏹️ Stopped WiFi scanning")
    
    def get_current_networks(self):
        """Get current list of access points"""
        return self.current_aps.copy()
    
    def get_scan_history(self):
        """Get scan history"""
        return self.scan_history.copy()

# Singleton instance
wifi_scanner = WiFiScanner()

# Simulated scanner for development
class SimulatedWiFiScanner:
    def __init__(self):
        self.simulated_aps = [
            {'ssid': 'Home-WiFi', 'bssid': 'AA:BB:CC:DD:EE:FF', 'signal': -45, 'channel': 6},
            {'ssid': 'Neighbor-2.4G', 'bssid': '11:22:33:44:55:66', 'signal': -65, 'channel': 11},
            {'ssid': 'Cafe-Free', 'bssid': 'FF:EE:DD:CC:BB:AA', 'signal': -72, 'channel': 1},
            {'ssid': 'Office-Guest', 'bssid': '99:88:77:66:55:44', 'signal': -58, 'channel': 36},
            {'ssid': 'Library-Public', 'bssid': '33:44:55:66:77:88', 'signal': -68, 'channel': 149}
        ]
    
    def scan(self):
        """Simulate WiFi scan with slight signal variations"""
        import random
        
        for ap in self.simulated_aps:
            # Simulate small signal variations
            ap['signal'] += random.randint(-3, 3)
            ap['signal'] = max(-90, min(-30, ap['signal']))  # Keep in realistic range
            ap['timestamp'] = datetime.now().isoformat()
        
        return self.simulated_aps.copy()
    
    def calculate_stability_score(self, history_minutes=5):
        """Simulate stability score"""
        return 0.7 + (random.random() * 0.2)  # 0.7-0.9 range #type: ignore
    
    def get_network_fingerprint(self):
        """Simulate network fingerprint"""
        return "simulated_fingerprint"

# Factory function to get appropriate scanner
def get_wifi_scanner(use_simulation=False):
    """
    Get WiFi scanner instance
    
    Args:
        use_simulation (bool): Whether to use simulated scanner
        
    Returns:
        WiFiScanner or SimulatedWiFiScanner instance
    """
    if use_simulation:
        return SimulatedWiFiScanner()
    
    try:
        # Try to create real scanner
        scanner = WiFiScanner()
        # Test scan
        test_result = scanner.scan()
        if test_result:
            print("✅ Real WiFi scanner initialized successfully")
            return scanner
        else:
            print("⚠️ Real scanner failed, falling back to simulation")
            return SimulatedWiFiScanner()
    except Exception as e:
        print(f"❌ Real scanner error: {e}, using simulation")
        return SimulatedWiFiScanner()
#!/usr/bin/env python3
"""
Simple startup script for Continuous 2FA Backend
"""
import os
import sys
import subprocess

def main():
    print("🚀 Starting Continuous 2FA Backend...")
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    os.chdir(backend_dir)
    
    # Run the optimized app
    try:
        subprocess.run([sys.executable, "app_optimized.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Backend stopped by user")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    main()
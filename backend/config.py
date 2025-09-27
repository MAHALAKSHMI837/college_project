# import os
# from datetime import timedelta

# class Config:
#     # JWT Configuration
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here-change-in-production'
#     JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
#     # Database Configuration
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///continuous_auth.db'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
    
#     # Behavioral Analytics Settings
#     BEHAVIORAL_SAMPLE_RATE = 0.1  # Sample 10% of events for analysis
#     RISK_THRESHOLD_HIGH = 0.8     # High risk threshold
#     RISK_THRESHOLD_MEDIUM = 0.5   # Medium risk threshold

import os
from datetime import timedelta

class Config:
    # JWT Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_super_secure_secret_key_here_make_it_very_long_and_random'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Database Configuration
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Behavioral Analytics Settings
    BEHAVIORAL_SAMPLE_RATE = 0.1  # Sample 10% of events for analysis
    RISK_THRESHOLD_HIGH = 0.8     # High risk threshold
    RISK_THRESHOLD_MEDIUM = 0.5   # Medium risk threshold
    
    # Trust Calculation Settings
    TYPING_WEIGHT = 0.4
    MOUSE_WEIGHT = 0.4
    CONTEXT_WEIGHT = 0.2
    
    # Security Settings
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_TIME = 15  # minutes
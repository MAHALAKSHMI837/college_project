import os
from datetime import timedelta

class Config:
    # JWT Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_super_secure_secret_key_here_make_it_very_long_and_random'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # PostgreSQL Configuration
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'auth_system')
    DB_USER = os.environ.get('DB_USER', 'postgres')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 1234)
    
    # PostgreSQL connection string
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Behavioral Analytics Settings
    BEHAVIORAL_SAMPLE_RATE = 0.1
    RISK_THRESHOLD_HIGH = 0.8
    RISK_THRESHOLD_MEDIUM = 0.5
    
    # Trust Calculation Weights
    TYPING_WEIGHT = 0.4
    MOUSE_WEIGHT = 0.4
    CONTEXT_WEIGHT = 0.2
    
    # External Services
    WIFI_SCANNER_ENABLED = os.environ.get('WIFI_SCANNER_ENABLED', 'false').lower() == 'true'
    AUDIO_ANALYZER_ENABLED = os.environ.get('AUDIO_ANALYZER_ENABLED', 'false').lower() == 'true'
    SMARTWATCH_INTEGRATION = os.environ.get('SMARTWATCH_INTEGRATION', 'false').lower() == 'true'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    DB_NAME = os.environ.get('DB_NAME') or 'continuous_2fa_dev'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    DB_NAME = os.environ.get('DB_NAME') or 'continuous_2fa_prod'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DB_NAME = os.environ.get('DB_NAME') or 'continuous_2fa_test'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}



# # import os
# # from datetime import timedelta

# # class Config:
# #     # JWT Configuration
# #     SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here-change-in-production'
# #     JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
# #     # Database Configuration
# #     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///continuous_auth.db'
# #     SQLALCHEMY_TRACK_MODIFICATIONS = False
    
# #     # Behavioral Analytics Settings
# #     BEHAVIORAL_SAMPLE_RATE = 0.1  # Sample 10% of events for analysis
# #     RISK_THRESHOLD_HIGH = 0.8     # High risk threshold
# #     RISK_THRESHOLD_MEDIUM = 0.5   # Medium risk threshold

# import os
# from datetime import timedelta

# class Config:
#     # JWT Configuration
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_super_secure_secret_key_here_make_it_very_long_and_random'
#     JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
#     # Database Configuration
#     DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database', 'users.db')
#     SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
    
#     # Behavioral Analytics Settings
#     BEHAVIORAL_SAMPLE_RATE = 0.1  # Sample 10% of events for analysis
#     RISK_THRESHOLD_HIGH = 0.8     # High risk threshold
#     RISK_THRESHOLD_MEDIUM = 0.5   # Medium risk threshold
    
#     # Trust Calculation Settings
#     TYPING_WEIGHT = 0.4
#     MOUSE_WEIGHT = 0.4
#     CONTEXT_WEIGHT = 0.2
    
#     # Security Settings
#     MAX_LOGIN_ATTEMPTS = 5
#     LOCKOUT_TIME = 15  # minutes


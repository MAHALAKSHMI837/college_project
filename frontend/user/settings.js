// Settings page functionality with localStorage persistence
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupToggleSwitches();
        this.setupRangeSliders();
        this.setupButtons();
        this.setupKeyboardShortcuts();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            layoutDensity: 'comfortable',
            fontSize: 14,
            refreshInterval: 30,
            notifications: {
                email: true,
                push: false,
                liveStream: true,
                decisions: true
            }
        };
        
        const saved = localStorage.getItem('continuous2fa_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('continuous2fa_settings', JSON.stringify(this.settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        const sectionTitle = document.getElementById('sectionTitle');
        const currentSection = document.querySelector('.current-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => section.style.display = 'none');
                
                // Show selected section
                const sectionId = item.getAttribute('href').substring(1) + '-content';
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
                
                // Update title and breadcrumb
                const sectionName = item.textContent.trim();
                sectionTitle.textContent = sectionName;
                currentSection.textContent = sectionName;
            });
        });
    }

    setupToggleSwitches() {
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingName = e.target.id;
                if (settingName) {
                    this.settings[settingName] = e.target.checked;
                    this.applySettings();
                }
            });
        });
    }

    setupRangeSliders() {
        const ranges = document.querySelectorAll('.setting-range');
        ranges.forEach(range => {
            const valueDisplay = range.nextElementSibling;
            
            range.addEventListener('input', (e) => {
                const value = e.target.value;
                const settingName = e.target.id;
                
                if (settingName === 'fontSize') {
                    valueDisplay.textContent = value + 'px';
                    this.settings.fontSize = parseInt(value);
                } else if (settingName === 'refreshInterval') {
                    valueDisplay.textContent = value + 's';
                    this.settings.refreshInterval = parseInt(value);
                }
                
                this.applySettings();
            });
        });
    }

    setupButtons() {
        // Test notification button
        const testBtn = document.querySelector('.test-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.showNotification('This is a test notification!', 'info');
            });
        }

        // Copy API key button
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('sk-1234567890abcdef').then(() => {
                    this.showNotification('API key copied to clipboard!', 'success');
                });
            });
        }

        // Save all settings button
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Regenerate API key
        const regenerateBtn = document.querySelector('.regenerate-btn');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
                    this.showNotification('API key regenerated successfully!', 'success');
                }
            });
        }

        // Connect buttons
        const connectBtns = document.querySelectorAll('.connect-btn');
        connectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('connected')) {
                    btn.textContent = 'Connect';
                    btn.classList.remove('connected');
                } else {
                    btn.textContent = 'Connected';
                    btn.classList.add('connected');
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Press 'S' to open settings (already in settings)
            if (e.key === 's' || e.key === 'S') {
                if (!e.target.matches('input, textarea')) {
                    e.preventDefault();
                    // Already in settings, maybe switch to first section
                }
            }
            
            // Press 'Escape' to go back to dashboard
            if (e.key === 'Escape') {
                window.location.href = '/';
            }
            
            // Press '/' to focus search (if exists)
            if (e.key === '/') {
                e.preventDefault();
                // Could add search functionality
            }
        });
    }

    applySettings() {
        // Apply dark mode
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Apply font size
        document.documentElement.style.setProperty('--font-size', this.settings.fontSize + 'px');
        
        // Update UI elements to reflect current settings
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) darkModeToggle.checked = this.settings.darkMode;
        
        const fontSizeRange = document.getElementById('fontSize');
        if (fontSizeRange) {
            fontSizeRange.value = this.settings.fontSize;
            const valueDisplay = fontSizeRange.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = this.settings.fontSize + 'px';
        }
        
        const refreshRange = document.getElementById('refreshInterval');
        if (refreshRange) {
            refreshRange.value = this.settings.refreshInterval;
            const valueDisplay = refreshRange.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = this.settings.refreshInterval + 's';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize settings manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});
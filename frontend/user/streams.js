// Streams page functionality
class StreamsManager {
    constructor() {
        this.isStreaming = true;
        this.autoScroll = true;
        this.eventCount = 1247;
        this.eventsPerMin = 23;
        this.init();
    }

    init() {
        this.setupControls();
        this.setupCharts();
        this.startSimulation();
    }

    setupControls() {
        // Load initial data from API
        this.loadStreamData();
        
        // Stream controls
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.toggleStream();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearStream();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportStream();
        });

        // Auto-scroll toggle
        document.getElementById('autoScrollBtn').addEventListener('click', () => {
            this.toggleAutoScroll();
        });

        // Filter checkboxes
        document.querySelectorAll('.filter-item input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    setupCharts() {
        // Event Rate Chart
        const eventRateCtx = document.getElementById('eventRateChart').getContext('2d');
        this.eventRateChart = new Chart(eventRateCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => `${14 + Math.floor(i/4)}:${(i%4)*15}`.padStart(2, '0')),
                datasets: [{
                    label: 'Events/Min',
                    data: Array.from({length: 20}, () => Math.floor(Math.random() * 30) + 10),
                    borderColor: '#5b8cff',
                    backgroundColor: 'rgba(91, 140, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });

        // Trust Distribution Chart
        const trustDistCtx = document.getElementById('trustDistChart').getContext('2d');
        this.trustDistChart = new Chart(trustDistCtx, {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#24d27b', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    toggleStream() {
        const btn = document.getElementById('pauseBtn');
        if (this.isStreaming) {
            this.isStreaming = false;
            btn.textContent = '▶ Resume';
            btn.classList.remove('active');
        } else {
            this.isStreaming = true;
            btn.textContent = '⏸ Pause';
            btn.classList.add('active');
        }
    }

    clearStream() {
        const container = document.getElementById('streamContainer');
        container.innerHTML = '<div class="stream-empty">Stream cleared. New events will appear here.</div>';
        this.eventCount = 0;
        document.getElementById('eventCount').textContent = '0';
    }

    exportStream() {
        // Simulate export
        this.showNotification('Stream data exported successfully!', 'success');
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const btn = document.getElementById('autoScrollBtn');
        btn.style.opacity = this.autoScroll ? '1' : '0.5';
    }

    applyFilters() {
        // Get checked filters
        const checkedFilters = Array.from(document.querySelectorAll('.filter-item input:checked'))
            .map(cb => cb.parentElement.textContent.trim().toLowerCase());
        
        // Show/hide events based on filters
        document.querySelectorAll('.stream-event').forEach(event => {
            const eventType = event.querySelector('.event-type').textContent.toLowerCase();
            const shouldShow = checkedFilters.some(filter => 
                eventType.includes(filter) || filter.includes(eventType)
            );
            event.style.display = shouldShow ? 'grid' : 'none';
        });
    }

    addEvent(type, title, details, level = 'info') {
        if (!this.isStreaming) return;

        const container = document.getElementById('streamContainer');
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const eventHtml = `
            <div class="stream-event ${level}">
                <div class="event-time">${timeStr}</div>
                <div class="event-type">${type}</div>
                <div class="event-content">
                    <div class="event-title">${title}</div>
                    <div class="event-details">${details}</div>
                </div>
                <div class="event-actions">
                    <button class="action-btn">📋</button>
                    <button class="action-btn">🔍</button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('afterbegin', eventHtml);

        // Remove old events (keep last 50)
        const events = container.querySelectorAll('.stream-event');
        if (events.length > 50) {
            events[events.length - 1].remove();
        }

        // Auto-scroll to top if enabled
        if (this.autoScroll) {
            container.scrollTop = 0;
        }

        // Update counters
        this.eventCount++;
        document.getElementById('eventCount').textContent = this.eventCount.toLocaleString();
    }

    startSimulation() {
        const eventTypes = [
            { type: 'AUTH', title: 'User authentication', level: 'success' },
            { type: 'WIFI', title: 'Wi-Fi signal change', level: 'info' },
            { type: 'AUDIO', title: 'Audio pattern analysis', level: 'info' },
            { type: 'WATCH', title: 'Smartwatch update', level: 'success' },
            { type: 'ALERT', title: 'Anomaly detected', level: 'warning' },
            { type: 'SYSTEM', title: 'Model inference', level: 'info' }
        ];

        setInterval(() => {
            if (this.isStreaming) {
                const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                const details = this.generateEventDetails(event.type);
                this.addEvent(event.type, event.title, details, event.level);
                
                // Update events per minute
                this.eventsPerMin = Math.floor(Math.random() * 20) + 15;
                document.getElementById('eventsPerMin').textContent = this.eventsPerMin;
            }
        }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds
    }

    generateEventDetails(type) {
        const details = {
            'AUTH': [
                'Trust Score: 0.89 • Wi-Fi: Stable • Audio: Normal',
                'Trust Score: 0.76 • Challenge required • Location verified',
                'Trust Score: 0.94 • All factors positive • High confidence'
            ],
            'WIFI': [
                'RSSI: -45dBm → -52dBm • AP: Office_5G • Stable connection',
                'New AP detected: Guest_Network • Signal: -67dBm',
                'Connection lost: Home_WiFi • Reconnecting...'
            ],
            'AUDIO': [
                'MFCC entropy: 0.67 • Environment: Office • Confidence: 89%',
                'Audio signature changed • New environment detected',
                'Background noise increased • Entropy: 0.84'
            ],
            'WATCH': [
                'Distance: 1.2m • Battery: 78% • Connection: Strong',
                'Proximity confirmed • Heartrate: 72 bpm • Active',
                'Watch disconnected • Last seen: 2 minutes ago'
            ],
            'ALERT': [
                'Behavioral anomaly • Confidence: 82% • Action: Monitor',
                'Suspicious pattern detected • Trust score dropped',
                'Multiple failed attempts • IP: 192.168.1.100'
            ],
            'SYSTEM': [
                'Processing time: 18ms • Features: 42 • Model: v2.1.4',
                'Cache updated • 1,247 patterns processed',
                'Model retrained • Accuracy improved to 94.8%'
            ]
        };
        
        const typeDetails = details[type] || ['System event processed'];
        return typeDetails[Math.floor(Math.random() * typeDetails.length)];
    }

    loadStreamData() {
        fetch('/api/streams/events')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear existing events and load from API
                    const container = document.getElementById('streamContainer');
                    container.innerHTML = '';
                    data.data.forEach(event => {
                        this.addEventFromAPI(event);
                    });
                }
            })
            .catch(error => console.log('Stream data loaded from simulation'));
    }

    addEventFromAPI(event) {
        const container = document.getElementById('streamContainer');
        const eventHtml = `
            <div class="stream-event ${event.level}">
                <div class="event-time">${event.time}</div>
                <div class="event-type">${event.type}</div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-details">${event.details}</div>
                </div>
                <div class="event-actions">
                    <button class="action-btn">📋</button>
                    <button class="action-btn">🔍</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', eventHtml);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
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
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StreamsManager();
});
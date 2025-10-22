class OptimizedDashboard {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.isVisible = true;
        this.cache = new Map();
        this.init();
    }
    
    init() {
        this.setupVisibilityHandler();
        this.setupCharts();
        this.startRealTimeUpdates();
    }
    
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.resumeUpdates();
            } else {
                this.pauseUpdates();
            }
        });
    }
    
    setupCharts() {
        const trustCtx = document.getElementById('trustChart');
        if (trustCtx) {
            this.charts.trust = new Chart(trustCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Trust Score',
                        data: [],
                        borderColor: '#5b8cff',
                        backgroundColor: 'rgba(91, 140, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 300 },
                    scales: {
                        y: { beginAtZero: true, max: 1 },
                        x: { display: true }
                    }
                }
            });
        }
    }
}
class OptimizedDashboard {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.isVisible = true;
        this.cache = new Map();
        this.init();
    }
    
    init() {
        this.setupVisibilityHandler();
        this.setupCharts();
        this.startRealTimeUpdates();
    }
    
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.resumeUpdates();
            } else {
                this.pauseUpdates();
            }
        });
    }
    
    setupCharts() {
        const trustCtx = document.getElementById('trustChart');
        if (trustCtx) {
            this.charts.trust = new Chart(trustCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Trust Score',
                        data: [],
                        borderColor: '#5b8cff',
                        backgroundColor: 'rgba(91, 140, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 300 },
                    scales: {
                        y: { beginAtZero: true, max: 1 },
                        x: { display: true }
                    }
                }
            });
        }
    }
    
    async fetchWithCache(url, cacheTime = 5000) {
        const now = Date.now();
        const cached = this.cache.get(url);
        
        if (cached && (now - cached.timestamp) < cacheTime) {
            return cached.data;
        }
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.cache.set(url, { data, timestamp: now });
            return data;
        } catch (error) {
            return cached ? cached.data : null;
        }
    }
    
    async updateTrustScore() {
        const data = await this.fetchWithCache('/api/trust/current');
        if (!data) return;
        
        const trustElement = document.getElementById('currentTrust');
        if (trustElement) {
            trustElement.textContent = (data.trust_score * 100).toFixed(1) + '%';
        }
        
        if (this.charts.trust) {
            const chart = this.charts.trust;
            chart.data.labels.push(new Date().toLocaleTimeString());
            chart.data.datasets[0].data.push(data.trust_score);
            
            if (chart.data.labels.length > 20) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            chart.update('none');
        }
    }
    
    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            if (this.isVisible) {
                this.updateTrustScore();
            }
        }, 2000);
    }
    
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    resumeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new OptimizedDashboard();
});
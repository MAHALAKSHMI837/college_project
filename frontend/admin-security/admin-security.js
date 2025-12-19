class F1SecurityDashboard {
    constructor() {
        this.charts = {};
        this.isRunning = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.updateTimestamp();
        this.createHeatMap();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    updateTimestamp() {
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }) + ' UTC';
        document.getElementById('timestamp').textContent = timestamp;
    }

    createHeatMap() {
        const heatmap = document.getElementById('heatmap');
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            this.updateHeatMapCell(cell);
            heatmap.appendChild(cell);
        }
    }

    updateHeatMapCell(cell) {
        const intensity = Math.random();
        if (intensity < 0.7) {
            cell.className = 'heatmap-cell low';
        } else if (intensity < 0.9) {
            cell.className = 'heatmap-cell medium';
        } else {
            cell.className = 'heatmap-cell high';
        }
    }

    initializeCharts() {
        this.createTimelineChart();
        this.createTrustTrendChart();
        this.createRiskSparkline();
    }

    createTimelineChart() {
        const ctx = document.getElementById('timelineChart').getContext('2d');
        const data = this.generateTimelineData();
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Allow',
                        data: data.allow,
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Challenge',
                        data: data.challenge,
                        borderColor: '#ff9500',
                        backgroundColor: 'rgba(255, 149, 0, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Block',
                        data: data.block,
                        borderColor: '#ff0040',
                        backgroundColor: 'rgba(255, 0, 64, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                elements: {
                    point: { radius: 0 }
                },
                animation: { duration: 0 }
            }
        });
    }

    createTrustTrendChart() {
        const ctx = document.getElementById('trustTrendChart').getContext('2d');
        const data = this.generateTrustTrendData();
        
        this.charts.trustTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: { duration: 0 }
            }
        });
    }

    createRiskSparkline() {
        const ctx = document.getElementById('riskSparkline').getContext('2d');
        const data = this.generateSparklineData();
        
        this.charts.riskSparkline = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: 'rgba(255, 0, 64, 0.6)',
                    borderColor: '#ff0040',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: { duration: 0 }
            }
        });
    }

    generateTimelineData() {
        const labels = [];
        const allow = [];
        const challenge = [];
        const block = [];
        
        for (let i = 0; i < 20; i++) {
            labels.push(i);
            allow.push(Math.random() * 50 + 30);
            challenge.push(Math.random() * 20 + 5);
            block.push(Math.random() * 10 + 2);
        }
        
        return { labels, allow, challenge, block };
    }

    generateTrustTrendData() {
        const labels = [];
        const values = [];
        const baseValue = 0.8;
        
        for (let i = 0; i < 30; i++) {
            labels.push(i);
            const variation = (Math.sin(i * 0.2) * 0.1) + (Math.random() - 0.5) * 0.05;
            values.push(Math.max(0, Math.min(1, baseValue + variation)));
        }
        
        return { labels, values };
    }

    generateSparklineData() {
        const labels = [];
        const values = [];
        
        for (let i = 0; i < 15; i++) {
            labels.push(i);
            values.push(Math.random() * 10);
        }
        
        return { labels, values };
    }

    updateRealTimeData() {
        // Update trust score
        const trustScore = document.getElementById('trustScore');
        const newTrust = (0.7 + Math.random() * 0.3).toFixed(2);
        trustScore.textContent = newTrust;

        // Update session time
        const sessionTime = document.getElementById('sessionTime');
        const time = new Date(Date.now() + Math.random() * 10000);
        const hours = String(Math.floor(Math.random() * 5) + 2).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        sessionTime.textContent = `${hours}:${minutes}:${seconds}`;

        // Update counters (less frequent)
        if (Math.random() < 0.3) this.updateCounters();

        // Update telemetry bars (less frequent)
        if (Math.random() < 0.4) this.updateTelemetryBars();

        // Update heat map (less frequent)
        if (Math.random() < 0.2) this.updateHeatMap();

        // Update charts (less frequent)
        if (Math.random() < 0.5) this.updateCharts();
    }

    updateCounters() {
        const elements = ['allowCount', 'challengeCount', 'blockCount'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (Math.random() < 0.05) {
                const current = parseInt(element.textContent.replace(',', ''));
                const increment = Math.floor(Math.random() * 2);
                element.textContent = (current + increment).toLocaleString();
            }
        });

        // Update decision times
        const timeElements = ['allowTime', 'challengeTime', 'blockTime'];
        timeElements.forEach(id => {
            if (Math.random() < 0.05) {
                const element = document.getElementById(id);
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
                element.textContent = timeStr;
            }
        });

        // Update failed attempts and risk spikes
        if (Math.random() < 0.1) {
            const failedAttempts = document.getElementById('failedAttempts');
            failedAttempts.textContent = Math.floor(Math.random() * 15) + 1;
        }

        if (Math.random() < 0.1) {
            const riskSpikes = document.getElementById('riskSpikes');
            riskSpikes.textContent = Math.floor(Math.random() * 8) + 1;
        }
    }

    updateTelemetryBars() {
        const bars = document.querySelectorAll('.telemetry-bar .bar-fill');
        const values = document.querySelectorAll('.telemetry-bar .bar-value');
        
        bars.forEach((bar, index) => {
            if (Math.random() < 0.3) {
                const newValue = Math.floor(Math.random() * 40) + 60;
                bar.style.width = newValue + '%';
                values[index].textContent = newValue + '%';
            }
        });
    }

    updateHeatMap() {
        const cells = document.querySelectorAll('.heatmap-cell');
        cells.forEach(cell => {
            if (Math.random() < 0.1) {
                this.updateHeatMapCell(cell);
            }
        });
    }

    updateCharts() {
        // Update timeline chart
        if (this.charts.timeline) {
            const newData = this.generateTimelineData();
            this.charts.timeline.data.datasets[0].data = newData.allow;
            this.charts.timeline.data.datasets[1].data = newData.challenge;
            this.charts.timeline.data.datasets[2].data = newData.block;
            this.charts.timeline.update('none');
        }

        // Update trust trend chart
        if (this.charts.trustTrend) {
            const chart = this.charts.trustTrend;
            chart.data.datasets[0].data.shift();
            const lastValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] || 0.8;
            const newValue = Math.max(0, Math.min(1, lastValue + (Math.random() - 0.5) * 0.1));
            chart.data.datasets[0].data.push(newValue);
            chart.update('none');
        }

        // Update risk sparkline
        if (this.charts.riskSparkline) {
            const chart = this.charts.riskSparkline;
            chart.data.datasets[0].data.shift();
            chart.data.datasets[0].data.push(Math.random() * 10);
            chart.update('none');
        }
    }

    startRealTimeUpdates() {
        this.isRunning = true;
        
        // Update timestamp every second
        setInterval(() => {
            if (this.isRunning) this.updateTimestamp();
        }, 1000);
        
        // Update data every 3 seconds
        setInterval(() => {
            if (this.isRunning) this.updateRealTimeData();
        }, 3000);
    }

    stopRealTimeUpdates() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new F1SecurityDashboard();
});

// Utility functions
window.F1Security = {
    formatTime: (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    },
    
    generateAlert: (type, message) => {
        console.log(`[${type.toUpperCase()}] ${message}`);
    },
    
    calculateRiskLevel: (trustScore) => {
        if (trustScore > 0.8) return 'LOW';
        if (trustScore > 0.6) return 'MEDIUM';
        return 'HIGH';
    }
};
const API_BASE = "http://127.0.0.1:5000/api";
let isStreaming = false;
let updateInterval;
let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;

console.log("✅ app.js is loaded!");

function initCharts() {
    console.log("📊 Initializing charts...");
    
    trustChart = new Chart(document.getElementById('trustChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Trust Score',
                data: [],
                borderColor: '#24d27b',
                tension: 0.4,
                fill: false,
                pointRadius: 3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 1, grid: { display: false } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    wifiChart = new Chart(document.getElementById('wifiChart'), {
        type: 'bar',
        data: {
            labels: ['AP-1', 'AP-2', 'AP-3', 'AP-4', 'AP-5'],
            datasets: [{
                data: [-45, -52, -60, -65, -70],
                backgroundColor: '#4f79bc',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { reverse: true, min: -90, max: -30, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    audioChart = new Chart(document.getElementById('audioChart'), {
        type: 'line',
        data: {
            labels: Array.from({length: 13}, (_, i) => `M${i+1}`),
            datasets: [{
                data: Array(13).fill(0).map(() => Math.random() * 2 + 1),
                borderColor: '#bc4f7d',
                tension: 0.4,
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 4, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    watchChart = new Chart(document.getElementById('watchChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Distance (m)',
                data: [],
                borderColor: '#4fbca9',
                tension: 0.4,
                fill: false,
                pointRadius: 2,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 10, grid: { display: false } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    driftChart = new Chart(document.getElementById('driftChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Drift Score',
                data: [],
                borderColor: '#d27b24',
                tension: 0.4,
                fill: false,
                pointRadius: 2,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 1, grid: { display: false } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    histChart = new Chart(document.getElementById('histChart'), {
        type: 'bar',
        data: {
            labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#24d27b', '#d2b624', '#d22424'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
    
    console.log("✅ Charts initialized successfully");
}

function updateWiFiData() {
    const newData = wifiChart.data.datasets[0].data.map(value => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(-90, Math.min(-30, value + change));
    });
    wifiChart.data.datasets[0].data = newData;
    wifiChart.update();
    return Math.random() * 0.2 + 0.7;
}

function updateAudioData() {
    const newData = audioChart.data.datasets[0].data.map(value => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(0.5, Math.min(3.5, value + change));
    });
    audioChart.data.datasets[0].data = newData;
    audioChart.update();
    return Math.random() * 0.2 + 0.6;
}

function updateWatchData() {
    const distance = Math.random() * 8 + 1;
    const timestamp = new Date().toLocaleTimeString();
    
    if (watchChart.data.labels.length > 8) {
        watchChart.data.labels.shift();
        watchChart.data.datasets[0].data.shift();
    }
    watchChart.data.labels.push(timestamp);
    watchChart.data.datasets[0].data.push(distance);
    watchChart.update();
    
    return Math.max(0, 1 - (distance / 10));
}

function updateDriftData() {
    const drift = Math.random() * 0.3;
    const timestamp = new Date().toLocaleTimeString();
    
    if (driftChart.data.labels.length > 8) {
        driftChart.data.labels.shift();
        driftChart.data.datasets[0].data.shift();
    }
    driftChart.data.labels.push(timestamp);
    driftChart.data.datasets[0].data.push(drift);
    driftChart.update();
    
    return drift;
}

function updateHistogram(decision) {
    const index = ['ALLOW', 'CHALLENGE', 'BLOCK'].indexOf(decision);
    if (index !== -1) {
        histChart.data.datasets[0].data[index]++;
        histChart.update();
    }
}

function startStream() {
    if (isStreaming) return;
    
    console.log("▶️ Starting stream...");
    isStreaming = true;
    
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'active';
    statusElement.className = 'status safe';
    
    document.getElementById('btnStart').classList.add('ghost');
    document.getElementById('btnStop').classList.remove('ghost');
    
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    let counter = 0;
    
    updateInterval = setInterval(() => {
        if (!isStreaming) return;
        
        counter++;
        
        const wifiScore = updateWiFiData();
        const audioScore = updateAudioData();
        const watchScore = updateWatchData();
        const driftScore = updateDriftData();
        
        const trustScore = (wifiScore * 0.3) + (audioScore * 0.3) + (watchScore * 0.3) - (driftScore * 0.3);
        const finalTrustScore = Math.max(0, Math.min(1, trustScore));
        
        document.getElementById('trustScore').textContent = finalTrustScore.toFixed(2);
        
        const now = new Date();
        const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
        
        if (trustChart.data.labels.length > 15) {
            trustChart.data.labels.shift();
            trustChart.data.datasets[0].data.shift();
        }
        trustChart.data.labels.push(timeLabel);
        trustChart.data.datasets[0].data.push(finalTrustScore);
        trustChart.update('none');
        
        if (counter % 5 === 0) {
            let result, note;
            if (finalTrustScore > 0.7) {
                result = "ALLOW";
                note = "Normal behavior pattern";
            } else if (finalTrustScore > 0.4) {
                result = "CHALLENGE";
                note = "Additional verification required";
            } else {
                result = "BLOCK";
                note = "Suspicious activity detected";
            }
            
            const tbody = document.getElementById('decisionsBody');
            const row = document.createElement('tr');
            const nowTime = new Date().toLocaleTimeString();
            
            row.innerHTML = `
                <td>${nowTime}</td>
                <td>${finalTrustScore.toFixed(2)}</td>
                <td>${result}</td>
                <td>${note}</td>
            `;
            
            if (tbody.firstChild) {
                tbody.insertBefore(row, tbody.firstChild);
            } else {
                tbody.appendChild(row);
            }
            
            while (tbody.children.length > 10) {
                tbody.removeChild(tbody.lastChild);
            }
            
            updateHistogram(result);
            
            try {
                fetch(`${API_BASE}/auth/decision`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: 1,
                        trust: finalTrustScore,
                        result: result,
                        note: note
                    })
                });
            } catch (error) {
                console.log("Backend not available, continuing locally");
            }
        }
        
    }, 2000);
}

function stopStream() {
    console.log("⏹️ Stopping stream...");
    isStreaming = false;
    
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'stopped';
    statusElement.className = 'status';
    
    document.getElementById('btnStart').classList.remove('ghost');
    document.getElementById('btnStop').classList.add('ghost');
    
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        if (isStreaming) {
            stopStream();
        }
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        window.location.href = '/login.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM loaded, initializing...");
    
    if (typeof Chart === 'undefined') {
        console.error("❌ Chart.js not loaded!");
        return;
    }
    
    initCharts();
    
    const startBtn = document.getElementById('btnStart');
    const stopBtn = document.getElementById('btnStop');
    const logoutBtn = document.getElementById('btnLogout');
    
    if (startBtn && stopBtn) {
        startBtn.addEventListener('click', startStream);
        stopBtn.addEventListener('click', stopStream);
        stopBtn.classList.add('ghost');
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    console.log("✅ System ready - click 'Start Stream' to begin");
});
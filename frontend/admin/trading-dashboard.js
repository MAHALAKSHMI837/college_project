// Trading Dashboard JavaScript
let charts = {};
let currentFilters = {
    user: 'all',
    dateRange: 'today',
    decisionType: 'all'
};
let liveMode = false;
let updateInterval;
let currentPage = 1;
let totalPages = 1;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeCharts();
    loadDashboardData();
    updateFilterSummary();
});

// Event Listeners
function initializeEventListeners() {
    // Filter controls
    document.getElementById('dateRange').addEventListener('change', handleDateRangeChange);
    document.getElementById('applyFilter').addEventListener('click', applyFilters);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
    document.getElementById('liveMode').addEventListener('change', toggleLiveMode);
    
    // Chart controls
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateTrustTrendChart(e.target.dataset.period);
        });
    });
    
    // Table controls
    document.getElementById('searchTable').addEventListener('input', searchTable);
    document.getElementById('downloadReport').addEventListener('click', downloadReport);
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

// Handle date range change
function handleDateRangeChange() {
    const dateRange = document.getElementById('dateRange').value;
    const customInputs = document.getElementById('customDateInputs');
    
    if (dateRange === 'custom') {
        customInputs.style.display = 'flex';
        // Set default dates
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        document.getElementById('startDate').value = weekAgo.toISOString().split('T')[0];
        document.getElementById('endDate').value = today.toISOString().split('T')[0];
    } else {
        customInputs.style.display = 'none';
    }
}

// Apply filters
function applyFilters() {
    currentFilters.user = document.getElementById('userSelect').value;
    currentFilters.dateRange = document.getElementById('dateRange').value;
    currentFilters.decisionType = document.getElementById('decisionType').value;
    
    if (currentFilters.dateRange === 'custom') {
        currentFilters.startDate = document.getElementById('startDate').value;
        currentFilters.endDate = document.getElementById('endDate').value;
    }
    
    updateFilterSummary();
    loadDashboardData();
    currentPage = 1;
    loadTableData();
}

// Reset filters
function resetFilters() {
    document.getElementById('userSelect').value = 'all';
    document.getElementById('dateRange').value = 'today';
    document.getElementById('decisionType').value = 'all';
    document.getElementById('customDateInputs').style.display = 'none';
    
    currentFilters = {
        user: 'all',
        dateRange: 'today',
        decisionType: 'all'
    };
    
    updateFilterSummary();
    loadDashboardData();
    currentPage = 1;
    loadTableData();
}

// Update filter summary
function updateFilterSummary() {
    const userText = currentFilters.user === 'all' ? 'All Users' : currentFilters.user;
    const dateText = currentFilters.dateRange === 'custom' ? 
        `${currentFilters.startDate} to ${currentFilters.endDate}` : 
        currentFilters.dateRange.charAt(0).toUpperCase() + currentFilters.dateRange.slice(1);
    const typeText = currentFilters.decisionType === 'all' ? 'All Decisions' : currentFilters.decisionType;
    
    document.getElementById('filterSummaryContent').innerHTML = `
        <p>Showing: ${userText}</p>
        <p>Period: ${dateText}</p>
        <p>Type: ${typeText}</p>
    `;
    
    document.getElementById('headerSummary').textContent = 
        `Analyzing ${userText.toLowerCase()} authentication patterns for ${dateText.toLowerCase()}`;
}

// Toggle live mode
function toggleLiveMode() {
    liveMode = document.getElementById('liveMode').checked;
    
    if (liveMode) {
        updateInterval = setInterval(() => {
            loadDashboardData();
            loadTableData();
        }, 10000); // Update every 10 seconds
    } else {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    }
}

// Initialize charts
function initializeCharts() {
    // Trust Trend Chart
    const trustCtx = document.getElementById('trustTrendChart').getContext('2d');
    charts.trustTrend = new Chart(trustCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Trust Score',
                data: [],
                borderColor: '#5b8cff',
                backgroundColor: 'rgba(91, 140, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    max: 1,
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });

    // Decision Pie Chart
    const decisionCtx = document.getElementById('decisionPieChart').getContext('2d');
    charts.decisionPie = new Chart(decisionCtx, {
        type: 'doughnut',
        data: {
            labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#24d27b', '#ffcc00', '#ff6b6b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e2e8f0' }
                }
            }
        }
    });

    // User Heatmap Chart
    const heatmapCtx = document.getElementById('userHeatmapChart').getContext('2d');
    charts.userHeatmap = new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: ['Maha', 'Admin', 'TestUser', 'User4'],
            datasets: [
                {
                    label: 'ALLOW',
                    data: [45, 30, 25, 20],
                    backgroundColor: '#24d27b'
                },
                {
                    label: 'CHALLENGE',
                    data: [10, 8, 12, 15],
                    backgroundColor: '#ffcc00'
                },
                {
                    label: 'BLOCK',
                    data: [5, 2, 3, 8],
                    backgroundColor: '#ff6b6b'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    stacked: true,
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                },
                y: { 
                    stacked: true,
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0' }
                }
            }
        }
    });

    // Hourly Activity Chart
    const hourlyCtx = document.getElementById('hourlyActivityChart').getContext('2d');
    charts.hourlyActivity = new Chart(hourlyCtx, {
        type: 'line',
        data: {
            labels: ['00', '04', '08', '12', '16', '20'],
            datasets: [{
                label: 'Activity',
                data: [5, 2, 15, 25, 30, 18],
                borderColor: '#24d27b',
                backgroundColor: 'rgba(36, 210, 123, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });

    // Trust Distribution Chart
    const trustDistCtx = document.getElementById('trustDistributionChart').getContext('2d');
    charts.trustDistribution = new Chart(trustDistCtx, {
        type: 'bar',
        data: {
            labels: ['0.0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0'],
            datasets: [{
                label: 'Count',
                data: [5, 12, 25, 35, 23],
                backgroundColor: ['#ff6b6b', '#ffcc00', '#ffa500', '#24d27b', '#20c997']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                },
                x: {
                    grid: { color: '#4a5568' },
                    ticks: { color: '#a0aec0' }
                }
            }
        }
    });
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API call - replace with actual API endpoints
    updateStatsCards();
    updateCharts();
}

// Update stats cards
function updateStatsCards() {
    // Simulate data based on filters
    const totalUsers = currentFilters.user === 'all' ? 4 : 1;
    const totalDecisions = Math.floor(Math.random() * 500) + 100;
    const avgTrust = (0.6 + Math.random() * 0.3).toFixed(2);
    const threatLevel = avgTrust > 0.8 ? 'LOW' : avgTrust > 0.6 ? 'MEDIUM' : 'HIGH';
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalDecisions').textContent = totalDecisions;
    document.getElementById('avgTrust').textContent = avgTrust;
    document.getElementById('threatLevel').textContent = threatLevel;
    
    // Update threat level color
    const threatCard = document.querySelector('.threat-indicator');
    if (threatLevel === 'LOW') {
        threatCard.querySelector('.stat-icon').style.background = 'rgba(36, 210, 123, 0.2)';
        threatCard.querySelector('.stat-content h3').style.color = '#24d27b';
    } else if (threatLevel === 'MEDIUM') {
        threatCard.querySelector('.stat-icon').style.background = 'rgba(255, 204, 0, 0.2)';
        threatCard.querySelector('.stat-content h3').style.color = '#ffcc00';
    } else {
        threatCard.querySelector('.stat-icon').style.background = 'rgba(255, 107, 107, 0.2)';
        threatCard.querySelector('.stat-content h3').style.color = '#ff6b6b';
    }
}

// Update charts
function updateCharts() {
    // Update trust trend with new data
    const now = new Date();
    const newData = [];
    const newLabels = [];
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        newLabels.push(time.getHours().toString().padStart(2, '0') + ':00');
        newData.push(0.5 + Math.random() * 0.4);
    }
    
    charts.trustTrend.data.labels = newLabels;
    charts.trustTrend.data.datasets[0].data = newData;
    charts.trustTrend.update('none');
    
    // Update decision pie chart
    const allowPercent = 60 + Math.random() * 20;
    const challengePercent = 15 + Math.random() * 15;
    const blockPercent = 100 - allowPercent - challengePercent;
    
    charts.decisionPie.data.datasets[0].data = [allowPercent, challengePercent, blockPercent];
    charts.decisionPie.update('none');
}

// Load table data
function loadTableData() {
    const tableBody = document.getElementById('decisionsTableBody');
    const decisions = generateMockDecisions();
    
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const pageDecisions = decisions.slice(startIndex, endIndex);
    
    pageDecisions.forEach(decision => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${decision.user}</td>
            <td>${decision.trustScore.toFixed(2)}</td>
            <td><span class="decision-${decision.result.toLowerCase()}">${decision.result}</span></td>
            <td>${decision.reason}</td>
            <td>${decision.timestamp}</td>
            <td><button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;">View</button></td>
        `;
        tableBody.appendChild(row);
    });
    
    totalPages = Math.ceil(decisions.length / 10);
    updatePagination();
}

// Generate mock decisions
function generateMockDecisions() {
    const users = ['Maha', 'Admin', 'TestUser', 'User4'];
    const results = ['ALLOW', 'CHALLENGE', 'BLOCK'];
    const reasons = [
        'All factors stable',
        'Wi-Fi variance detected',
        'Audio entropy spike',
        'Watch disconnected',
        'Multiple anomalies',
        'Location change detected',
        'Time-based anomaly'
    ];
    
    const decisions = [];
    for (let i = 0; i < 50; i++) {
        const user = currentFilters.user === 'all' ? 
            users[Math.floor(Math.random() * users.length)] : 
            currentFilters.user;
        
        const result = currentFilters.decisionType === 'all' ? 
            results[Math.floor(Math.random() * results.length)] : 
            currentFilters.decisionType;
        
        const trustScore = result === 'ALLOW' ? 0.7 + Math.random() * 0.3 :
                          result === 'CHALLENGE' ? 0.4 + Math.random() * 0.4 :
                          Math.random() * 0.4;
        
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        decisions.push({
            user,
            trustScore,
            result,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            timestamp: timestamp.toLocaleString()
        });
    }
    
    return decisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Update pagination
function updatePagination() {
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Change page
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadTableData();
    }
}

// Search table
function searchTable() {
    const searchTerm = document.getElementById('searchTable').value.toLowerCase();
    const rows = document.querySelectorAll('#decisionsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Download report
function downloadReport() {
    // Simulate report download
    const data = generateMockDecisions();
    const csv = convertToCSV(data);
    downloadCSV(csv, 'continuous-2fa-report.csv');
}

// Convert to CSV
function convertToCSV(data) {
    const headers = ['User', 'Trust Score', 'Decision', 'Reason', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            row.user,
            row.trustScore.toFixed(2),
            row.result,
            `"${row.reason}"`,
            row.timestamp
        ].join(','))
    ].join('\n');
    
    return csvContent;
}

// Download CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Update trust trend chart period
function updateTrustTrendChart(period) {
    // Simulate different time periods
    const now = new Date();
    let labels = [];
    let data = [];
    
    if (period === '24h') {
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
            data.push(0.5 + Math.random() * 0.4);
        }
    } else if (period === '7d') {
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(0.5 + Math.random() * 0.4);
        }
    } else if (period === '30d') {
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            labels.push(date.getDate().toString());
            data.push(0.5 + Math.random() * 0.4);
        }
    }
    
    charts.trustTrend.data.labels = labels;
    charts.trustTrend.data.datasets[0].data = data;
    charts.trustTrend.update();
}

// Initialize table data on load
setTimeout(() => {
    loadTableData();
}, 1000);
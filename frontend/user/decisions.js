// Decisions page functionality
class DecisionsManager {
    constructor() {
        this.autoRefresh = false;
        this.explainMode = true;
        this.decisions = [];
        this.init();
    }

    init() {
        this.setupControls();
        this.setupCharts();
        this.setupFilters();
        this.loadDecisions();
    }

    setupControls() {
        // Auto-refresh toggle
        document.getElementById('autoRefreshBtn').addEventListener('click', () => {
            this.toggleAutoRefresh();
        });

        // Explain mode toggle
        document.getElementById('explainModeBtn').addEventListener('click', () => {
            this.toggleExplainMode();
        });

        // Refresh button
        document.getElementById('btnRefresh').addEventListener('click', () => {
            this.refreshDecisions();
        });

        // Export button
        document.getElementById('btnExport').addEventListener('click', () => {
            this.exportDecisions();
        });

        // Feedback buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('feedback')) {
                this.handleFeedback(e.target);
            }
        });
    }

    setupCharts() {
        // Decision Trends Chart
        const trendsCtx = document.getElementById('decisionTrendsChart').getContext('2d');
        this.trendsChart = new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [
                    {
                        label: 'Allow',
                        data: Array.from({length: 24}, () => Math.floor(Math.random() * 50) + 30),
                        borderColor: '#24d27b',
                        backgroundColor: 'rgba(36, 210, 123, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Challenge',
                        data: Array.from({length: 24}, () => Math.floor(Math.random() * 20) + 5),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Block',
                        data: Array.from({length: 24}, () => Math.floor(Math.random() * 10) + 2),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { color: '#e7edf7', font: { size: 11 } }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#7b8aa0', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: { 
                        ticks: { color: '#7b8aa0', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });

        // Confidence Distribution Chart
        const confidenceCtx = document.getElementById('confidenceChart').getContext('2d');
        this.confidenceChart = new Chart(confidenceCtx, {
            type: 'bar',
            data: {
                labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
                datasets: [{
                    label: 'Decisions',
                    data: [12, 45, 123, 567, 1234],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#6b7280',
                        '#3b82f6',
                        '#24d27b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        ticks: { color: '#7b8aa0', font: { size: 10 } },
                        grid: { display: false }
                    },
                    y: { 
                        ticks: { color: '#7b8aa0', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    setupFilters() {
        // Decision type filters
        document.querySelectorAll('.filter-item input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Confidence slider
        const confidenceSlider = document.querySelector('.confidence-slider');
        const confidenceValue = document.querySelector('.confidence-value');
        
        confidenceSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            confidenceValue.textContent = `Min: ${value}%`;
            this.applyFilters();
        });

        // Time filter
        document.querySelector('.time-filter').addEventListener('change', () => {
            this.applyFilters();
        });
    }

    toggleAutoRefresh() {
        this.autoRefresh = !this.autoRefresh;
        const btn = document.getElementById('autoRefreshBtn');
        
        if (this.autoRefresh) {
            btn.style.background = '#5b8cff';
            btn.style.color = 'white';
            this.startAutoRefresh();
        } else {
            btn.style.background = 'transparent';
            btn.style.color = '#7b8aa0';
            this.stopAutoRefresh();
        }
    }

    toggleExplainMode() {
        this.explainMode = !this.explainMode;
        const btn = document.getElementById('explainModeBtn');
        const explanations = document.querySelectorAll('.decision-explanation');
        
        if (this.explainMode) {
            btn.style.background = '#5b8cff';
            btn.style.color = 'white';
            explanations.forEach(exp => exp.style.display = 'block');
        } else {
            btn.style.background = 'transparent';
            btn.style.color = '#7b8aa0';
            explanations.forEach(exp => exp.style.display = 'none');
        }
    }

    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.addNewDecision();
        }, 8000); // Add new decision every 8 seconds
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    loadDecisions() {
        // Load decisions from API
        fetch('/api/decisions/recent')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update with API data if available
                    console.log('Loaded decisions from API:', data.data);
                }
            })
            .catch(error => console.log('Using simulated decision data'));
        
        this.updateSummaryStats();
    }

    addNewDecision() {
        const decisionTypes = ['allow', 'challenge', 'block'];
        const type = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
        const decision = this.generateDecision(type);
        
        const decisionsList = document.getElementById('decisionsList');
        decisionsList.insertAdjacentHTML('afterbegin', decision);
        
        // Remove old decisions (keep last 20)
        const decisions = decisionsList.querySelectorAll('.decision-item');
        if (decisions.length > 20) {
            decisions[decisions.length - 1].remove();
        }
        
        this.updateSummaryStats();
    }

    generateDecision(type) {
        const now = new Date();
        const id = `#D2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
        const timeAgo = 'Just now';
        
        const users = [
            'john.doe@company.com',
            'sarah.wilson@company.com',
            'mike.johnson@company.com',
            'emma.davis@company.com',
            'alex.brown@company.com'
        ];
        
        const user = users[Math.floor(Math.random() * users.length)];
        
        let trustScore, confidence, factors, explanation, resultClass, resultText;
        
        switch (type) {
            case 'allow':
                trustScore = (0.8 + Math.random() * 0.2).toFixed(2);
                confidence = Math.floor(85 + Math.random() * 15);
                resultClass = 'allow';
                resultText = 'ALLOW';
                factors = [
                    { type: 'positive', icon: '📶', text: `Wi-Fi pattern matches (${90 + Math.floor(Math.random() * 10)}%)` },
                    { type: 'positive', icon: '🎵', text: `Audio environment consistent (${85 + Math.floor(Math.random() * 15)}%)` },
                    { type: 'positive', icon: '⌚', text: `Smartwatch proximity confirmed (${95 + Math.floor(Math.random() * 5)}%)` }
                ];
                explanation = 'High confidence decision based on consistent behavioral patterns. All authentication factors show strong positive correlation with user\'s historical profile.';
                break;
                
            case 'challenge':
                trustScore = (0.5 + Math.random() * 0.3).toFixed(2);
                confidence = Math.floor(60 + Math.random() * 25);
                resultClass = 'challenge';
                resultText = 'CHALLENGE';
                factors = [
                    { type: 'positive', icon: '📶', text: `Wi-Fi location verified (${80 + Math.floor(Math.random() * 15)}%)` },
                    { type: 'negative', icon: '🎵', text: `Unusual audio signature (${15 + Math.floor(Math.random() * 25)}%)` },
                    { type: 'neutral', icon: '⌚', text: 'Watch data unavailable' }
                ];
                explanation = 'Moderate confidence challenge due to anomalous patterns. Recommend additional verification step before granting access.';
                break;
                
            case 'block':
                trustScore = (0.1 + Math.random() * 0.3).toFixed(2);
                confidence = Math.floor(85 + Math.random() * 15);
                resultClass = 'block';
                resultText = 'BLOCK';
                factors = [
                    { type: 'negative', icon: '📶', text: `Unknown Wi-Fi network (${Math.floor(Math.random() * 20)}%)` },
                    { type: 'negative', icon: '🎵', text: `Audio spoofing detected (${Math.floor(Math.random() * 25)}%)` },
                    { type: 'negative', icon: '⌚', text: 'No smartwatch detected (0%)' }
                ];
                explanation = 'High confidence block due to multiple security violations. All authentication factors indicate potential fraud or unauthorized access attempt.';
                break;
        }
        
        const factorsHtml = factors.map(factor => 
            `<div class="factor ${factor.type}">
                <span class="factor-icon">${factor.icon}</span>
                <span class="factor-text">${factor.text}</span>
            </div>`
        ).join('');
        
        return `
            <div class="decision-item ${resultClass}">
                <div class="decision-header">
                    <div class="decision-id">${id}</div>
                    <div class="decision-time">${timeAgo}</div>
                    <div class="decision-result ${resultClass}">${resultText}</div>
                </div>
                <div class="decision-content">
                    <div class="decision-title">Authentication Request</div>
                    <div class="decision-details">
                        <div class="detail-item">
                            <span class="detail-label">User:</span>
                            <span class="detail-value">${user}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Trust Score:</span>
                            <span class="detail-value trust-${trustScore > 0.7 ? 'high' : trustScore > 0.4 ? 'medium' : 'low'}">${trustScore}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Confidence:</span>
                            <span class="detail-value">${confidence}%</span>
                        </div>
                    </div>
                    <div class="decision-factors">
                        ${factorsHtml}
                    </div>
                    <div class="decision-explanation" style="display: ${this.explainMode ? 'block' : 'none'}">
                        <strong>AI Explanation:</strong> ${explanation}
                    </div>
                </div>
                <div class="decision-actions">
                    <button class="action-btn feedback" title="Mark as Correct">👍</button>
                    <button class="action-btn feedback" title="Mark as Incorrect">👎</button>
                    <button class="action-btn" title="View Details">🔍</button>
                    <button class="action-btn" title="Export">📋</button>
                </div>
            </div>
        `;
    }

    updateSummaryStats() {
        // Simulate updating summary statistics
        const allowCard = document.querySelector('.summary-card.allow .summary-value');
        const challengeCard = document.querySelector('.summary-card.challenge .summary-value');
        const blockCard = document.querySelector('.summary-card.block .summary-value');
        const reviewCard = document.querySelector('.summary-card.review .summary-value');
        
        if (allowCard) allowCard.textContent = (parseInt(allowCard.textContent.replace(',', '')) + Math.floor(Math.random() * 3)).toLocaleString();
        if (challengeCard) challengeCard.textContent = (parseInt(challengeCard.textContent) + Math.floor(Math.random() * 2)).toLocaleString();
        if (blockCard) blockCard.textContent = (parseInt(blockCard.textContent) + Math.floor(Math.random() * 2)).toLocaleString();
    }

    applyFilters() {
        const checkedTypes = Array.from(document.querySelectorAll('.filter-item input:checked'))
            .map(cb => cb.parentElement.textContent.trim().toLowerCase());
        
        const minConfidence = parseInt(document.querySelector('.confidence-slider').value);
        
        document.querySelectorAll('.decision-item').forEach(item => {
            const resultType = item.classList[1]; // allow, challenge, block, review
            const confidenceText = item.querySelector('.detail-value:last-child').textContent;
            const confidence = parseInt(confidenceText.replace('%', ''));
            
            const typeMatch = checkedTypes.includes(resultType);
            const confidenceMatch = confidence >= minConfidence;
            
            item.style.display = (typeMatch && confidenceMatch) ? 'block' : 'none';
        });
    }

    handleFeedback(button) {
        const isPositive = button.title.includes('Correct');
        const decisionItem = button.closest('.decision-item');
        const decisionId = decisionItem.querySelector('.decision-id').textContent;
        
        // Send feedback to API
        fetch('/api/decisions/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                decision_id: decisionId,
                feedback: isPositive ? 'correct' : 'incorrect'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Visual feedback
                button.style.background = isPositive ? '#24d27b' : '#ef4444';
                button.style.color = 'white';
                button.disabled = true;
                
                // Show notification
                this.showNotification(
                    `Feedback recorded for ${decisionId}: ${isPositive ? 'Correct' : 'Incorrect'}`,
                    isPositive ? 'success' : 'warning'
                );
            }
        })
        .catch(error => {
            // Fallback to local feedback
            button.style.background = isPositive ? '#24d27b' : '#ef4444';
            button.style.color = 'white';
            button.disabled = true;
            
            this.showNotification(
                `Feedback recorded locally for ${decisionId}`,
                'info'
            );
        });
        
        // Update feedback stats (simulate)
        const feedbackCount = document.querySelector(`.feedback-icon.${isPositive ? 'positive' : 'negative'}`).nextElementSibling;
        feedbackCount.textContent = (parseInt(feedbackCount.textContent) + 1).toLocaleString();
    }

    refreshDecisions() {
        this.showNotification('Refreshing decisions...', 'info');
        // Simulate refresh by adding a new decision
        setTimeout(() => {
            this.addNewDecision();
            this.showNotification('Decisions refreshed successfully!', 'success');
        }, 1000);
    }

    exportDecisions() {
        this.showNotification('Exporting decision data...', 'info');
        // Simulate export
        setTimeout(() => {
            this.showNotification('Decision data exported successfully!', 'success');
        }, 1500);
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
    new DecisionsManager();
});
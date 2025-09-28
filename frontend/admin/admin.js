//     const API_BASE = "http://127.0.0.1:5000/api";
//     let trustTrendChart, decisionPieChart;
//     let refreshInterval;

//     // Load all data for the admin dashboard
//     async function loadAllData() {
//       try {
//         console.log("🔄 Loading admin data...");
        
//         // Load users
//         await loadUsers();
        
//         // Load decisions
//         await loadDecisions();
        
//         // Load stats
//         await loadStats();
        
//         // Update last updated timestamp
//         document.getElementById('lastUpdated').textContent = 
//           `Last updated: ${new Date().toLocaleTimeString()}`;
          
//       } catch (error) {
//         console.error("Error loading admin data:", error);
//       }
//     }

//     // Load users from backend
//     async function loadUsers() {
//       try {
//         const response = await fetch(`${API_BASE}/admin/users`);
//         if (!response.ok) throw new Error('Failed to fetch users');
        
//         const users = await response.json();
//         const tbody = document.getElementById('usersBody');
        
//         if (users.length === 0) {
//           tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
//           return;
//         }
        
//         tbody.innerHTML = '';
//         users.forEach(user => {
//           const tr = document.createElement('tr');
//           const joinDate = new Date(user.created_at).toLocaleDateString();
          
//           tr.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.username}</td>
//             <td>${user.device || 'Unknown'}</td>
//             <td>${joinDate}</td>
//           `;
          
//           tbody.appendChild(tr);
//         });
        
//         // Update total users count
//         document.getElementById('totalUsers').textContent = users.length;
        
//       } catch (error) {
//         console.error("Error loading users:", error);
//         document.getElementById('usersBody').innerHTML = 
//           '<tr><td colspan="4">Error loading users</td></tr>';
//       }
//     }

//     // Load decisions from backend
//     async function loadDecisions() {
//       try {
//         const response = await fetch(`${API_BASE}/admin/decisions`);
//         if (!response.ok) throw new Error('Failed to fetch decisions');
        
//         const decisions = await response.json();
//         const tbody = document.getElementById('decisionsBody');
        
//         if (decisions.length === 0) {
//           tbody.innerHTML = '<tr><td colspan="4">No decisions found</td></tr>';
//           return;
//         }
        
//         tbody.innerHTML = '';
//         const decisionCounts = { ALLOW: 0, CHALLENGE: 0, BLOCK: 0 };
//         let totalTrust = 0;
        
//         // Show latest 10 decisions
//         const recentDecisions = decisions.slice(0, 10);
        
//         recentDecisions.forEach(decision => {
//           const tr = document.createElement('tr');
//           const time = new Date(decision.timestamp).toLocaleTimeString();
          
//           // Add class based on decision result
//           let decisionClass = '';
//           if (decision.result === 'ALLOW') decisionClass = 'allow';
//           else if (decision.result === 'CHALLENGE') decisionClass = 'challenge';
//           else if (decision.result === 'BLOCK') decisionClass = 'block';
          
//           tr.innerHTML = `
//             <td>${decision.username}</td>
//             <td>${decision.trust.toFixed(2)}</td>
//             <td class="${decisionClass}">${decision.result}</td>
//             <td>${time}</td>
//           `;
          
//           tbody.appendChild(tr);
          
//           // Count decisions for stats
//           decisionCounts[decision.result]++;
//           totalTrust += decision.trust;
//         });
        
//         // Update total decisions count
//         document.getElementById('totalDecisions').textContent = decisions.length;
        
//         // Update average trust score
//         const avgTrust = decisions.length > 0 ? (totalTrust / decisions.length).toFixed(2) : '0.00';
//         document.getElementById('avgTrust').textContent = avgTrust;
        
//         // Update trust trend chart
//         updateTrustTrendChart(decisions);
        
//         // Update decision pie chart
//         updateDecisionPieChart(decisionCounts);
        
//       } catch (error) {
//         console.error("Error loading decisions:", error);
//         document.getElementById('decisionsBody').innerHTML = 
//           '<tr><td colspan="4">Error loading decisions</td></tr>';
//       }
//     }

//     // Load statistics
//     async function loadStats() {
//       try {
//         const response = await fetch(`${API_BASE}/admin/stats`);
//         if (response.ok) {
//           const stats = await response.json();
//           // Stats are already updated in loadDecisions
//         }
//       } catch (error) {
//         console.log("Stats endpoint not available, using calculated stats");
//       }
//     }

//     // Update trust trend chart
//     function updateTrustTrendChart(decisions) {
//       // Group decisions by hour for the last 24 hours
//       const now = new Date();
//       const hours = Array(24).fill(0).map((_, i) => {
//         const time = new Date(now);
//         time.setHours(now.getHours() - 23 + i);
//         return time;
//       });
      
//       const hourlyAverages = Array(24).fill(null);
//       const hourlyCounts = Array(24).fill(0);
      
//       decisions.forEach(decision => {
//         const decisionTime = new Date(decision.timestamp);
//         const hourDiff = Math.floor((now - decisionTime) / (1000 * 60 * 60));
        
//         if (hourDiff >= 0 && hourDiff < 24) {
//           const index = 23 - hourDiff;
//           if (hourlyAverages[index] === null) {
//             hourlyAverages[index] = decision.trust;
//             hourlyCounts[index] = 1;
//           } else {
//             hourlyAverages[index] += decision.trust;
//             hourlyCounts[index]++;
//           }
//         }
//       });
      
//       // Calculate averages
//       const averages = hourlyAverages.map((sum, i) => 
//         hourlyCounts[i] > 0 ? (sum / hourlyCounts[i]) : 0
//       );
      
//       // Create or update chart
//       const ctx = document.getElementById('trustTrend').getContext('2d');
      
//       if (trustTrendChart) {
//         trustTrendChart.data.labels = hours.map(h => h.getHours() + ':00');
//         trustTrendChart.data.datasets[0].data = averages;
//         trustTrendChart.update();
//       } else {
//         trustTrendChart = new Chart(ctx, {
//           type: 'line',
//           data: {
//             labels: hours.map(h => h.getHours() + ':00'),
//             datasets: [{
//               label: 'Average Trust Score',
//               data: averages,
//               borderColor: '#5b8cff',
//               tension: 0.4,
//               fill: false,
//               pointBackgroundColor: '#5b8cff',
//               pointBorderColor: '#5b8cff',
//               pointRadius: 3
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 max: 1,
//                 grid: { color: 'rgba(255,255,255,0.1)' }
//               },
//               x: { 
//                 grid: { display: false }
//               }
//             },
//             plugins: {
//               legend: { display: false }
//             }
//           }
//         });
//       }
//     }

//     // Update decision pie chart
//     function updateDecisionPieChart(decisionCounts) {
//       const ctx = document.getElementById('decisionPie').getContext('2d');
//       const data = [
//         decisionCounts.ALLOW || 0,
//         decisionCounts.CHALLENGE || 0,
//         decisionCounts.BLOCK || 0
//       ];
      
//       if (decisionPieChart) {
//         decisionPieChart.data.datasets[0].data = data;
//         decisionPieChart.update();
//       } else {
//         decisionPieChart = new Chart(ctx, {
//           type: 'pie',
//           data: {
//             labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
//             datasets: [{
//               data: data,
//               backgroundColor: ['#24d27b', '#ffcc00', '#ff6b6b'],
//               borderWidth: 0
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               legend: {
//                 position: 'bottom',
//                 labels: { color: '#e7edf7' }
//               }
//             }
//           }
//         });
//       }
//     }

//     // Initialize auto-refresh
//     function initAutoRefresh() {
//       const autoRefreshCheckbox = document.getElementById('autoRefresh');
      
//       autoRefreshCheckbox.addEventListener('change', function() {
//         if (this.checked) {
//           startAutoRefresh();
//         } else {
//           stopAutoRefresh();
//         }
//       });
      
//       // Start auto-refresh by default
//       startAutoRefresh();
//     }

//     function startAutoRefresh() {
//       stopAutoRefresh(); // Clear any existing interval
//       refreshInterval = setInterval(loadAllData, 10000); // Refresh every 10 seconds
//       console.log("🔄 Auto-refresh enabled");
//     }

//     function stopAutoRefresh() {
//       if (refreshInterval) {
//         clearInterval(refreshInterval);
//         refreshInterval = null;
//         console.log("⏹️ Auto-refresh disabled");
//       }
//     }

//     // Initialize when page loads
//     document.addEventListener('DOMContentLoaded', function() {
//       console.log("🚀 Admin dashboard loaded");
      
//       // Load initial data
//       loadAllData();
      
//       // Set up auto-refresh
//       initAutoRefresh();
//     });

//=============================================================================================================
// const API_BASE = "http://127.0.0.1:5000/api";   crt backend url below is updated

// // Check authentication
// function checkAuth() {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');
    
//     if (!token || !userId) {
//         window.location.href = '/login.html';
//         return false;
//     }
    
//     return true;
// }

// // Load system statistics
// async function loadSystemStats() {
//     try {
//         const response = await fetch('/api/admin/stats');
//         if (response.ok) {
//             const stats = await response.json();
            
//             document.getElementById('totalUsers').textContent = stats.total_users;
//             document.getElementById('totalDecisions').textContent = stats.total_decisions;
//             document.getElementById('avgTrustScore').textContent = stats.average_trust_score.toFixed(2);
//         }
//     } catch (error) {
//         console.error('Error loading stats:', error);
//     }
// }

// // Load users
// async function loadUsers() {
//     try {
//         const response = await fetch('/api/admin/users');
//         const tbody = document.getElementById('usersBody');
        
//         if (response.ok) {
//             const users = await response.json();
            
//             if (users.length === 0) {
//                 tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
//                 return;
//             }
            
//             tbody.innerHTML = users.map(user => `
//                 <tr>
//                     <td><strong>${user.id}</strong></td>
//                     <td>${user.username}</td>
//                     <td>${user.email || 'N/A'}</td>
//                     <td>${user.device || 'Unknown'}</td>
//                     <td>${new Date(user.created_at).toLocaleDateString()}</td>
//                 </tr>
//             `).join('');
//         }
//     } catch (error) {
//         console.error('Error loading users:', error);
//     }
// }

// // Load decisions
// async function loadDecisions() {
//     try {
//         const response = await fetch('/api/admin/decisions');
//         const tbody = document.getElementById('decisionsBody');
        
//         if (response.ok) {
//             const decisions = await response.json();
            
//             if (decisions.length === 0) {
//                 tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No decisions found</td></tr>';
//                 return;
//             }
            
//             tbody.innerHTML = decisions.map(decision => {
//                 const decisionClass = `decision-${decision.decision.toLowerCase()}`;
//                 return `
//                     <tr>
//                         <td>${new Date(decision.created_at).toLocaleString()}</td>
//                         <td><strong>${decision.username}</strong></td>
//                         <td style="font-weight: bold;">${decision.trust_score.toFixed(2)}</td>
//                         <td class="${decisionClass}">${decision.decision}</span></td>
//                         <td>${decision.note}</td>
//                     </tr>
//                 `;
//             }).join('');
//         }
//     } catch (error) {
//         console.error('Error loading decisions:', error);
//     }
// }

// // Refresh all data
// async function refreshData() {
//     console.log('🔄 Refreshing admin data...');
//     await loadSystemStats();
//     await loadUsers();
//     await loadDecisions();
// }

// // Logout function
// function logout() {
//     if (confirm('Are you sure you want to logout?')) {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userId');
//         localStorage.removeItem('username');
//         window.location.href = '/login.html';
//     }
// }

// // Initialize admin dashboard
// // Initialize when page loads - ENHANCED VERSION
// document.addEventListener('DOMContentLoaded', async function() {
//     console.log("🚀 DOM loaded, initializing...");
    
//     // Check authentication first
//     if (!checkAuth()) {
//         return;
//     }
    
//     // Get user profile
//     await getUserProfile();
    
//     // Check if Chart.js is available
//     if (typeof Chart === 'undefined') {
//         console.error("❌ Chart.js not loaded! Add: <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>");
//         return;
//     }
    
//     // Initialize charts
//     initCharts();
    
//     // Add event listeners to buttons - ENHANCED WITH PROPER ERROR HANDLING
//     const startBtn = document.getElementById('btnStart');
//     const stopBtn = document.getElementById('btnStop');
//     const logoutBtn = document.getElementById('btnLogout');
    
//     console.log('🔘 Button elements found:', {
//         startBtn: !!startBtn,
//         stopBtn: !!stopBtn,
//         logoutBtn: !!logoutBtn
//     });
    
//     if (startBtn) {
//         startBtn.addEventListener('click', startStream);
//         console.log('✅ Start button listener added');
//     }
    
//     if (stopBtn) {
//         stopBtn.addEventListener('click', stopStream);
//         stopBtn.classList.add('ghost');
//         console.log('✅ Stop button listener added');
//     }
    
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', logout);
//         console.log('✅ Logout button listener added');
        
//         // Make logout button visible (remove ghost class)
//         logoutBtn.classList.remove('ghost');
//     } else {
//         console.error('❌ Logout button not found! Check HTML ID');
//     }
    
//     console.log("✅ System ready - click 'Start Stream' to begin");
// });
  

// //============================================================================================================
const API_BASE = "http://127.0.0.1:5000/api";

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    console.log('🔐 Admin auth check:', {
        token: token ? 'Present' : 'Missing',
        userId: userId
    });
    
    if (!token || !userId) {
        console.log('❌ Admin not authenticated, redirecting to login');
        window.location.href = '/login.html';
        return false;
    }
    
    console.log('✅ Admin authentication passed');
    return true;
}
// Test if admin APIs are working
async function testAdminAPIs() {
    console.log('🧪 Testing admin APIs...');
    
    try {
        const stats = await fetch('/api/admin/stats').then(r => r.json());
        console.log('📊 Stats API:', stats);
        
        const users = await fetch('/api/admin/users').then(r => r.json());
        console.log('👥 Users API:', users);
        
        const decisions = await fetch('/api/admin/decisions').then(r => r.json());
        console.log('📋 Decisions API:', decisions);
        
    } catch (error) {
        console.error('❌ API test failed:', error);
    }
}

testAdminAPIs();

// Load system statistics
async function loadSystemStats() {
    try {
        console.log('📊 Loading system stats...');
        const response = await fetch('/api/admin/stats');
        
        if (response.ok) {
            const stats = await response.json();
            console.log('✅ System stats loaded:', stats);
            
            // Update the UI with actual data
            document.getElementById('totalUsers').textContent = stats.total_users || 0;
            document.getElementById('totalDecisions').textContent = stats.total_decisions || 0;
            document.getElementById('avgTrustScore').textContent = stats.average_trust_score ? stats.average_trust_score.toFixed(2) : '0.00';
            document.getElementById('systemStatusValue').textContent = stats.system_status || 'Active';
            
        } else {
            console.error('❌ Failed to load stats:', response.status);
            // Set fallback values
            setFallbackStats();
        }
    } catch (error) {
        console.error('❌ Error loading stats:', error);
        setFallbackStats();
    }
}

// Fallback stats if API fails
function setFallbackStats() {
    console.log('⚠️ Using fallback stats');
    document.getElementById('totalUsers').textContent = '1';
    document.getElementById('totalDecisions').textContent = '0';
    document.getElementById('avgTrustScore').textContent = '0.00';
    document.getElementById('systemStatusValue').textContent = 'Active';
}

// Load users
async function loadUsers() {
    try {
        console.log('👥 Loading users...');
        const response = await fetch('/api/admin/users');
        const tbody = document.getElementById('usersBody');
        
        if (response.ok) {
            const users = await response.json();
            console.log('✅ Users loaded:', users.length);
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7b8aa0;">No users found</td></tr>';
                return;
            }
            
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td><strong>${user.id}</strong></td>
                    <td>${user.username || 'Unknown'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.device || 'Unknown Device'}</td>
                    <td>${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</td>
                </tr>
            `).join('');
            
        } else {
            console.error('❌ Failed to load users:', response.status);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #d22424;">Error loading users</td></tr>';
        }
    } catch (error) {
        console.error('❌ Error loading users:', error);
        document.getElementById('usersBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: #d22424;">Connection error</td></tr>';
    }
}

// Load decisions
async function loadDecisions() {
    try {
        console.log('📋 Loading decisions...');
        const response = await fetch('/api/admin/decisions');
        const tbody = document.getElementById('decisionsBody');
        
        if (response.ok) {
            const decisions = await response.json();
            console.log('✅ Decisions loaded:', decisions.length);
            
            if (decisions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7b8aa0;">No decisions found</td></tr>';
                return;
            }
            
            tbody.innerHTML = decisions.map(decision => {
                const decisionClass = `decision-${decision.decision ? decision.decision.toLowerCase() : 'unknown'}`;
                return `
                    <tr>
                        <td>${decision.created_at ? new Date(decision.created_at).toLocaleString() : 'Unknown'}</td>
                        <td><strong>${decision.username || 'Unknown User'}</strong></td>
                        <td style="font-weight: bold;">${decision.trust_score ? decision.trust_score.toFixed(2) : '0.00'}</td>
                        <td class="${decisionClass}">${decision.decision || 'UNKNOWN'}</td>
                        <td>${decision.note || 'No reason provided'}</td>
                    </tr>
                `;
            }).join('');
            
        } else {
            console.error('❌ Failed to load decisions:', response.status);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #d22424;">Error loading decisions</td></tr>';
        }
    } catch (error) {
        console.error('❌ Error loading decisions:', error);
        document.getElementById('decisionsBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: #d22424;">Connection error</td></tr>';
    }
}

// Refresh all data
async function refreshData() {
    console.log('🔄 Refreshing admin data...');
    await loadSystemStats();
    await loadUsers();
    await loadDecisions();
    console.log('✅ Admin data refresh complete');
}

// Logout function
function logout() {
    console.log('🚪 Admin logout initiated...');
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear all authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        console.log('✅ Admin authentication data cleared');
        
        // Redirect to login page
        window.location.href = '/login.html';
    }
}

// Add manual refresh button
function addRefreshButton() {
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔄 Refresh';
    refreshButton.className = 'btn-refresh';
    refreshButton.style.background = '#24d27b';
    refreshButton.style.color = 'white';
    refreshButton.style.border = 'none';
    refreshButton.style.padding = '10px 15px';
    refreshButton.style.borderRadius = '8px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.marginLeft = '10px';
    refreshButton.style.fontWeight = '600';
    
    refreshButton.addEventListener('click', refreshData);
    
    // Add to admin info section
    const adminInfo = document.querySelector('.admin-info');
    if (adminInfo) {
        adminInfo.appendChild(refreshButton);
    }
}

// Debug function to check what's loading
function debugAdminLoad() {
    console.log('🔍 Admin debug info:');
    console.log('- Total Users element:', document.getElementById('totalUsers'));
    console.log('- Users table body:', document.getElementById('usersBody'));
    console.log('- Decisions table body:', document.getElementById('decisionsBody'));
    console.log('- Logout button:', document.getElementById('btnLogout'));
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Admin Dashboard Loading...');
    
    // Debug first
    debugAdminLoad();
    
    if (!checkAuth()) {
        return;
    }
    
    // Add refresh button
    addRefreshButton();
    
    // Load initial data
    await refreshData();
    
    // Add event listeners
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
        console.log('✅ Admin logout listener added');
    } else {
        console.error('❌ Admin logout button not found!');
    }
    
    // Auto-refresh every 30 seconds
    setInterval(refreshData, 30000);
    
    console.log('✅ Admin Dashboard Ready!');
    
    // Force refresh after 2 seconds (in case of initial load issues)
    setTimeout(refreshData, 2000);
});

//=========================================================================================================
// // const API_BASE = "http://127.0.0.1:5000/api";    // updated backend url
// // let decisionChart = null;
// // let trustTrendChart = null;

// // // Check authentication
// // function checkAuth() {
// //     const token = localStorage.getItem('authToken');
// //     const userId = localStorage.getItem('userId');
    
// //     if (!token || !userId) {
// //         window.location.href = '/login.html';
// //         return false;
// //     }
    
// //     return true;
// // }

// // // Load system statistics
// // async function loadSystemStats() {
// //     try {
// //         const response = await fetch('/api/admin/stats');
// //         if (response.ok) {
// //             const stats = await response.json();
            
// //             document.getElementById('totalUsers').textContent = stats.total_users;
// //             document.getElementById('totalDecisions').textContent = stats.total_decisions;
// //             document.getElementById('avgTrustScore').textContent = stats.average_trust_score.toFixed(2);
// //             document.getElementById('systemStatusValue').textContent = 'Active';
            
// //             updateDecisionChart(stats.decision_breakdown);
// //         }
// //     } catch (error) {
// //         console.error('Error loading stats:', error);
// //         // Set default values
// //         document.getElementById('totalUsers').textContent = '1';
// //         document.getElementById('totalDecisions').textContent = '0';
// //         document.getElementById('avgTrustScore').textContent = '0.00';
// //     }
// // }

// // // Load users
// // async function loadUsers() {
// //     try {
// //         const response = await fetch('/api/admin/users');
// //         const tbody = document.getElementById('usersBody');
        
// //         if (response.ok) {
// //             const users = await response.json();
            
// //             if (users.length === 0) {
// //                 tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
// //                 return;
// //             }
            
// //             tbody.innerHTML = users.map(user => `
// //                 <tr>
// //                     <td><strong>${user.id}</strong></td>
// //                     <td>${user.username}</td>
// //                     <td>${user.email || 'N/A'}</td>
// //                     <td>${user.device || 'Unknown'}</td>
// //                     <td>${new Date(user.created_at).toLocaleDateString()}</td>
// //                 </tr>
// //             `).join('');
// //         } else {
// //             tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #e74c3c;">Error loading users</td></tr>';
// //         }
// //     } catch (error) {
// //         console.error('Error loading users:', error);
// //         document.getElementById('usersBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: #e74c3c;">Connection error</td></tr>';
// //     }
// // }

// // // Load decisions
// // async function loadDecisions() {
// //     try {
// //         const response = await fetch('/api/admin/decisions');
// //         const tbody = document.getElementById('decisionsBody');
        
// //         if (response.ok) {
// //             const decisions = await response.json();
            
// //             if (decisions.length === 0) {
// //                 tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No decisions found</td></tr>';
// //                 return;
// //             }
            
// //             tbody.innerHTML = decisions.map(decision => {
// //                 const decisionClass = `decision-${decision.decision.toLowerCase()}`;
// //                 return `
// //                     <tr>
// //                         <td>${new Date(decision.created_at).toLocaleString()}</td>
// //                         <td><strong>${decision.username}</strong></td>
// //                         <td style="font-weight: bold;">${decision.trust_score.toFixed(2)}</td>
// //                         <td><span class="${decisionClass}">${decision.decision}</span></td>
// //                         <td>${decision.note}</td>
// //                     </tr>
// //                 `;
// //             }).join('');
// //         } else {
// //             tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #e74c3c;">Error loading decisions</td></tr>';
// //         }
// //     } catch (error) {
// //         console.error('Error loading decisions:', error);
// //         document.getElementById('decisionsBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: #e74c3c;">Connection error</td></tr>';
// //     }
// // }

// // // Initialize decision chart
// // function initDecisionChart() {
// //     const ctx = document.getElementById('decisionChart');
// //     if (!ctx) {
// //         console.error('Decision chart canvas not found');
// //         return;
// //     }
    
// //     decisionChart = new Chart(ctx, {
// //         type: 'doughnut',
// //         data: {
// //             labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
// //             datasets: [{
// //                 data: [65, 25, 10],
// //                 backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
// //                 borderWidth: 3,
// //                 borderColor: '#ffffff'
// //             }]
// //         },
// //         options: {
// //             responsive: true,
// //             maintainAspectRatio: false,
// //             plugins: {
// //                 legend: {
// //                     position: 'bottom',
// //                     labels: {
// //                         font: {
// //                             size: 12,
// //                             weight: 'bold'
// //                         }
// //                     }
// //                 }
// //             }
// //         }
// //     });
// // }

// // // Initialize trust trend chart
// // function initTrustTrendChart() {
// //     const ctx = document.getElementById('trustTrendChart');
// //     if (!ctx) {
// //         console.error('Trust trend chart canvas not found');
// //         return;
// //     }
    
// //     // Generate sample data for the chart
// //     const labels = Array.from({length: 12}, (_, i) => `${i * 2}h ago`);
// //     const data = Array(12).fill(0).map(() => Math.random() * 0.4 + 0.5);
    
// //     trustTrendChart = new Chart(ctx, {
// //         type: 'line',
// //         data: {
// //             labels: labels,
// //             datasets: [{
// //                 label: 'Average Trust Score',
// //                 data: data,
// //                 borderColor: '#3498db',
// //                 backgroundColor: 'rgba(52, 152, 219, 0.1)',
// //                 borderWidth: 3,
// //                 tension: 0.4,
// //                 fill: true
// //             }]
// //         },
// //         options: {
// //             responsive: true,
// //             maintainAspectRatio: false,
// //             scales: {
// //                 y: {
// //                     beginAtZero: true,
// //                     max: 1,
// //                     grid: {
// //                         color: 'rgba(0,0,0,0.1)'
// //                     }
// //                 },
// //                 x: {
// //                     grid: {
// //                         color: 'rgba(0,0,0,0.1)'
// //                     }
// //                 }
// //             },
// //             plugins: {
// //                 legend: {
// //                     display: true,
// //                     position: 'top'
// //                 }
// //             }
// //         }
// //     });
// // }

// // // Update decision chart with real data
// // function updateDecisionChart(breakdown) {
// //     if (!decisionChart) return;
    
// //     decisionChart.data.datasets[0].data = [
// //         breakdown.ALLOW || 0,
// //         breakdown.CHALLENGE || 0,
// //         breakdown.BLOCK || 0
// //     ];
    
// //     decisionChart.update();
// // }

// // // Refresh all data
// // async function refreshData() {
// //     console.log('🔄 Refreshing admin data...');
// //     await loadSystemStats();
// //     await loadUsers();
// //     await loadDecisions();
// // }

// // // Logout function
// // function logout() {
// //     if (confirm('Are you sure you want to logout?')) {
// //         localStorage.removeItem('authToken');
// //         localStorage.removeItem('userId');
// //         localStorage.removeItem('username');
// //         window.location.href = '/login.html';
// //     }
// // }

// // // Initialize admin dashboard
// // document.addEventListener('DOMContentLoaded', async function() {
// //     console.log('🚀 Admin Dashboard Loading...');
    
// //     if (!checkAuth()) {
// //         return;
// //     }
    
// //     // Initialize charts
// //     initDecisionChart();
// //     initTrustTrendChart();
    
// //     // Load initial data
// //     await refreshData();
    
// //     // Add event listeners
// //     document.getElementById('btnLogout').addEventListener('click', logout);
    
// //     // Auto-refresh every 30 seconds
// //     setInterval(refreshData, 30000);
    
// //     console.log('✅ Admin Dashboard Ready!');
    
// //     // Add manual refresh button functionality
// //     const refreshButton = document.createElement('button');
// //     refreshButton.textContent = 'Refresh Data';
// //     refreshButton.style.background = '#3498db';
// //     refreshButton.style.color = 'white';
// //     refreshButton.style.marginLeft = '10px';
// //     refreshButton.addEventListener('click', refreshData);
    
// //     document.querySelector('.admin-info').appendChild(refreshButton);
// // });
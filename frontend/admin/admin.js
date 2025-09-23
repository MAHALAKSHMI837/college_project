// const API_BASE = "http://192.168.1.3:5000/api";

// // Load all users
// async function loadUsers() {
//   try {
//     const res = await fetch(`${API_BASE}/admin/users`);
//     if (!res.ok) throw new Error("Failed to fetch users");
//     const users = await res.json();

//     const usersTable = document.getElementById("users");
//     usersTable.innerHTML = "";
//     users.forEach(user => {
//       const row = `<tr>
//         <td>${user.id}</td>
//         <td>${user.username}</td>
//         <td>${user.device}</td>
//       </tr>`;
//       usersTable.innerHTML += row;
//     });
//   } catch (err) {
//     console.error("Error fetching users:", err);
//   }
// }

// // Load all decisions
// async function loadDecisions() {
//   try {
//     const res = await fetch(`${API_BASE}/admin/decisions`);
//     if (!res.ok) throw new Error("Failed to fetch decisions");
//     const decisions = await res.json();

//     const decisionsTable = document.getElementById("decisions");
//     decisionsTable.innerHTML = "";
//     decisions.forEach(dec => {
//       const row = `<tr>
//         <td>${dec.user_id}</td>
//         <td>${dec.decision}</td>
//         <td>${dec.trust_score}</td>
//         <td>${dec.timestamp}</td>
//       </tr>`;
//       decisionsTable.innerHTML += row;
//     });
//   } catch (err) {
//     console.error("Error fetching decisions:", err);
//   }
// }

// // Refresh every 5s
// setInterval(() => {
//   loadUsers();
//   loadDecisions();
// }, 5000);

// // Run once on load
// loadUsers();
// loadDecisions();
// ---------------- Config ----------------
// ---------------- Config ----------------
// const API_BASE = "http://127.0.0.1:5000/api";  

// // --------- Utility ---------
// function fmtTime(t) {
//   return new Date(t).toLocaleTimeString();
// }

// // --------- Chart Setup (using Chart.js) ---------
// let trustChart, decisionPie;

// // Initialize charts
// function initCharts() {
//   const trustCtx = document.getElementById("trustTrend").getContext("2d");
//   trustChart = new Chart(trustCtx, {
//     type: "line",
//     data: {
//       labels: [],
//       datasets: [{
//         label: "Trust Score",
//         data: [],
//         borderColor: "#5b8cff",
//         fill: false
//       }]
//     },
//     options: { responsive: true, scales: { y: { min: 0, max: 1 } } }
//   });

//   const pieCtx = document.getElementById("decisionPie").getContext("2d");
//   decisionPie = new Chart(pieCtx, {
//     type: "pie",
//     data: {
//       labels: ["Safe", "Anomalous"],
//       datasets: [{
//         data: [0, 0],
//         backgroundColor: ["#4caf50", "#f44336"]
//       }]
//     },
//     options: { responsive: true }
//   });
// }

// // --------- Load Users ---------
// async function loadUsers() {
//   try {
//     const res = await fetch(`${API_BASE}/admin/user`);
//     if (!res.ok) throw new Error("Failed to fetch users");
//     const users = await res.json();

//     const table = document.getElementById("usersBody");
//     table.innerHTML = "";
//     users.forEach(user => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${user.id}</td>
//         <td>${user.username}</td>
//         <td>${user.device}</td>
//       `;
//       table.appendChild(row);
//     });

//   } catch (err) {
//     console.error("Error fetching users:", err);
//   }
// }

// // --------- Load Decisions ---------
// async function loadDecisions() {
//   try {
//     const res = await fetch(`${API_BASE}/admin/decisions`);
//     if (!res.ok) throw new Error("Failed to fetch decisions");
//     const decisions = await res.json();

//     const table = document.getElementById("decisionsBody");
//     table.innerHTML = "";

//     let safeCount = 0, anomCount = 0;
//     const trustScores = [], labels = [];

//     decisions.forEach(dec => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${dec.user_id}</td>
//         <td>${dec.decision}</td>
//         <td>${dec.trust_score.toFixed(2)}</td>
//         <td>${fmtTime(dec.timestamp)}</td>
//       `;
//       table.appendChild(row);

//       // graph data
//       trustScores.push(dec.trust_score);
//       labels.push(fmtTime(dec.timestamp));
//       if (dec.decision === "ALLOW") safeCount++; else anomCount++;
//     });

//     // update line chart
//     trustChart.data.labels = labels;
//     trustChart.data.datasets[0].data = trustScores;
//     trustChart.update();

//     // update pie chart
//     decisionPie.data.datasets[0].data = [safeCount, anomCount];
//     decisionPie.update();

//   } catch (err) {
//     console.error("Error fetching decisions:", err);
//   }
// }

// // --------- Auto Refresh ---------
// function refreshAdminData() {
//   loadUsers();
//   loadDecisions();
// }

// // --------- Init ---------
// window.onload = function() {
//   initCharts();
//   refreshAdminData();
//   setInterval(refreshAdminData, 5000);
// };


// ---------------- Config ----------------
    const API_BASE = "http://127.0.0.1:5000/api";
    let trustTrendChart, decisionPieChart;
    let refreshInterval;

    // Load all data for the admin dashboard
    async function loadAllData() {
      try {
        console.log("🔄 Loading admin data...");
        
        // Load users
        await loadUsers();
        
        // Load decisions
        await loadDecisions();
        
        // Load stats
        await loadStats();
        
        // Update last updated timestamp
        document.getElementById('lastUpdated').textContent = 
          `Last updated: ${new Date().toLocaleTimeString()}`;
          
      } catch (error) {
        console.error("Error loading admin data:", error);
      }
    }

    // Load users from backend
    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE}/admin/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const users = await response.json();
        const tbody = document.getElementById('usersBody');
        
        if (users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
          return;
        }
        
        tbody.innerHTML = '';
        users.forEach(user => {
          const tr = document.createElement('tr');
          const joinDate = new Date(user.created_at).toLocaleDateString();
          
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.device || 'Unknown'}</td>
            <td>${joinDate}</td>
          `;
          
          tbody.appendChild(tr);
        });
        
        // Update total users count
        document.getElementById('totalUsers').textContent = users.length;
        
      } catch (error) {
        console.error("Error loading users:", error);
        document.getElementById('usersBody').innerHTML = 
          '<tr><td colspan="4">Error loading users</td></tr>';
      }
    }

    // Load decisions from backend
    async function loadDecisions() {
      try {
        const response = await fetch(`${API_BASE}/admin/decisions`);
        if (!response.ok) throw new Error('Failed to fetch decisions');
        
        const decisions = await response.json();
        const tbody = document.getElementById('decisionsBody');
        
        if (decisions.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4">No decisions found</td></tr>';
          return;
        }
        
        tbody.innerHTML = '';
        const decisionCounts = { ALLOW: 0, CHALLENGE: 0, BLOCK: 0 };
        let totalTrust = 0;
        
        // Show latest 10 decisions
        const recentDecisions = decisions.slice(0, 10);
        
        recentDecisions.forEach(decision => {
          const tr = document.createElement('tr');
          const time = new Date(decision.timestamp).toLocaleTimeString();
          
          // Add class based on decision result
          let decisionClass = '';
          if (decision.result === 'ALLOW') decisionClass = 'allow';
          else if (decision.result === 'CHALLENGE') decisionClass = 'challenge';
          else if (decision.result === 'BLOCK') decisionClass = 'block';
          
          tr.innerHTML = `
            <td>${decision.username}</td>
            <td>${decision.trust.toFixed(2)}</td>
            <td class="${decisionClass}">${decision.result}</td>
            <td>${time}</td>
          `;
          
          tbody.appendChild(tr);
          
          // Count decisions for stats
          decisionCounts[decision.result]++;
          totalTrust += decision.trust;
        });
        
        // Update total decisions count
        document.getElementById('totalDecisions').textContent = decisions.length;
        
        // Update average trust score
        const avgTrust = decisions.length > 0 ? (totalTrust / decisions.length).toFixed(2) : '0.00';
        document.getElementById('avgTrust').textContent = avgTrust;
        
        // Update trust trend chart
        updateTrustTrendChart(decisions);
        
        // Update decision pie chart
        updateDecisionPieChart(decisionCounts);
        
      } catch (error) {
        console.error("Error loading decisions:", error);
        document.getElementById('decisionsBody').innerHTML = 
          '<tr><td colspan="4">Error loading decisions</td></tr>';
      }
    }

    // Load statistics
    async function loadStats() {
      try {
        const response = await fetch(`${API_BASE}/admin/stats`);
        if (response.ok) {
          const stats = await response.json();
          // Stats are already updated in loadDecisions
        }
      } catch (error) {
        console.log("Stats endpoint not available, using calculated stats");
      }
    }

    // Update trust trend chart
    function updateTrustTrendChart(decisions) {
      // Group decisions by hour for the last 24 hours
      const now = new Date();
      const hours = Array(24).fill(0).map((_, i) => {
        const time = new Date(now);
        time.setHours(now.getHours() - 23 + i);
        return time;
      });
      
      const hourlyAverages = Array(24).fill(null);
      const hourlyCounts = Array(24).fill(0);
      
      decisions.forEach(decision => {
        const decisionTime = new Date(decision.timestamp);
        const hourDiff = Math.floor((now - decisionTime) / (1000 * 60 * 60));
        
        if (hourDiff >= 0 && hourDiff < 24) {
          const index = 23 - hourDiff;
          if (hourlyAverages[index] === null) {
            hourlyAverages[index] = decision.trust;
            hourlyCounts[index] = 1;
          } else {
            hourlyAverages[index] += decision.trust;
            hourlyCounts[index]++;
          }
        }
      });
      
      // Calculate averages
      const averages = hourlyAverages.map((sum, i) => 
        hourlyCounts[i] > 0 ? (sum / hourlyCounts[i]) : 0
      );
      
      // Create or update chart
      const ctx = document.getElementById('trustTrend').getContext('2d');
      
      if (trustTrendChart) {
        trustTrendChart.data.labels = hours.map(h => h.getHours() + ':00');
        trustTrendChart.data.datasets[0].data = averages;
        trustTrendChart.update();
      } else {
        trustTrendChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: hours.map(h => h.getHours() + ':00'),
            datasets: [{
              label: 'Average Trust Score',
              data: averages,
              borderColor: '#5b8cff',
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#5b8cff',
              pointBorderColor: '#5b8cff',
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                grid: { color: 'rgba(255,255,255,0.1)' }
              },
              x: { 
                grid: { display: false }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }

    // Update decision pie chart
    function updateDecisionPieChart(decisionCounts) {
      const ctx = document.getElementById('decisionPie').getContext('2d');
      const data = [
        decisionCounts.ALLOW || 0,
        decisionCounts.CHALLENGE || 0,
        decisionCounts.BLOCK || 0
      ];
      
      if (decisionPieChart) {
        decisionPieChart.data.datasets[0].data = data;
        decisionPieChart.update();
      } else {
        decisionPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
            datasets: [{
              data: data,
              backgroundColor: ['#24d27b', '#ffcc00', '#ff6b6b'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: '#e7edf7' }
              }
            }
          }
        });
      }
    }

    // Initialize auto-refresh
    function initAutoRefresh() {
      const autoRefreshCheckbox = document.getElementById('autoRefresh');
      
      autoRefreshCheckbox.addEventListener('change', function() {
        if (this.checked) {
          startAutoRefresh();
        } else {
          stopAutoRefresh();
        }
      });
      
      // Start auto-refresh by default
      startAutoRefresh();
    }

    function startAutoRefresh() {
      stopAutoRefresh(); // Clear any existing interval
      refreshInterval = setInterval(loadAllData, 10000); // Refresh every 10 seconds
      console.log("🔄 Auto-refresh enabled");
    }

    function stopAutoRefresh() {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log("⏹️ Auto-refresh disabled");
      }
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
      console.log("🚀 Admin dashboard loaded");
      
      // Load initial data
      loadAllData();
      
      // Set up auto-refresh
      initAutoRefresh();
    });
  
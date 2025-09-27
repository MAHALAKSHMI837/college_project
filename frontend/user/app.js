
// // // // // const API_BASE = "http://127.0.0.1:5000/api";
// // // // // let isStreaming = false;
// // // // // let updateInterval;
// // // // // let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;

// // // // // console.log("✅ app.js is loaded!");

// // // // // // Initialize all charts
// // // // // function initCharts() {
// // // // //     console.log("📊 Initializing charts...");
    
// // // // //     // Trust Score Chart
// // // // //     trustChart = new Chart(document.getElementById('trustChart'), {
// // // // //         type: 'line',
// // // // //         data: {
// // // // //             labels: [],
// // // // //             datasets: [{
// // // // //                 label: 'Trust Score',
// // // // //                 data: [],
// // // // //                 borderColor: '#24d27b',
// // // // //                 tension: 0.4,
// // // // //                 fill: false,
// // // // //                 pointRadius: 3,
// // // // //                 borderWidth: 2
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: {
// // // // //                     beginAtZero: true,
// // // // //                     max: 1,
// // // // //                     grid: { display: false }
// // // // //                 },
// // // // //                 x: { display: false }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });

// // // // //     // WiFi RSSI Chart
// // // // //     wifiChart = new Chart(document.getElementById('wifiChart'), {
// // // // //         type: 'bar',
// // // // //         data: {
// // // // //             labels: ['AP-1', 'AP-2', 'AP-3', 'AP-4', 'AP-5'],
// // // // //             datasets: [{
// // // // //                 data: [-45, -52, -60, -65, -70],
// // // // //                 backgroundColor: '#4f79bc',
// // // // //                 borderWidth: 0
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: { 
// // // // //                     reverse: true,
// // // // //                     min: -90,
// // // // //                     max: -30,
// // // // //                     grid: { display: false }
// // // // //                 }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });

// // // // //     // Audio MFCC Chart
// // // // //     audioChart = new Chart(document.getElementById('audioChart'), {
// // // // //         type: 'line',
// // // // //         data: {
// // // // //             labels: Array.from({length: 13}, (_, i) => `M${i+1}`),
// // // // //             datasets: [{
// // // // //                 data: Array(13).fill(0).map(() => Math.random() * 2 + 1),
// // // // //                 borderColor: '#bc4f7d',
// // // // //                 tension: 0.4,
// // // // //                 fill: false,
// // // // //                 borderWidth: 2
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: { 
// // // // //                     min: 0,
// // // // //                     max: 4,
// // // // //                     grid: { display: false }
// // // // //                 },
// // // // //                 x: { grid: { display: false } }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });

// // // // //     // Watch Proximity Chart
// // // // //     watchChart = new Chart(document.getElementById('watchChart'), {
// // // // //         type: 'line',
// // // // //         data: {
// // // // //             labels: [],
// // // // //             datasets: [{
// // // // //                 label: 'Distance (m)',
// // // // //                 data: [],
// // // // //                 borderColor: '#4fbca9',
// // // // //                 tension: 0.4,
// // // // //                 fill: false,
// // // // //                 pointRadius: 2,
// // // // //                 borderWidth: 2
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: {
// // // // //                     min: 0,
// // // // //                     max: 10,
// // // // //                     grid: { display: false }
// // // // //                 },
// // // // //                 x: { display: false }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });

// // // // //     // Feature Drift Chart
// // // // //     driftChart = new Chart(document.getElementById('driftChart'), {
// // // // //         type: 'line',
// // // // //         data: {
// // // // //             labels: [],
// // // // //             datasets: [{
// // // // //                 label: 'Drift Score',
// // // // //                 data: [],
// // // // //                 borderColor: '#d27b24',
// // // // //                 tension: 0.4,
// // // // //                 fill: false,
// // // // //                 pointRadius: 2,
// // // // //                 borderWidth: 2
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: {
// // // // //                     min: 0,
// // // // //                     max: 1,
// // // // //                     grid: { display: false }
// // // // //                 },
// // // // //                 x: { display: false }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });

// // // // //     // Decision Histogram
// // // // //     histChart = new Chart(document.getElementById('histChart'), {
// // // // //         type: 'bar',
// // // // //         data: {
// // // // //             labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
// // // // //             datasets: [{
// // // // //                 data: [0, 0, 0],
// // // // //                 backgroundColor: ['#24d27b', '#d2b624', '#d22424'],
// // // // //                 borderWidth: 0
// // // // //             }]
// // // // //         },
// // // // //         options: {
// // // // //             responsive: true,
// // // // //             maintainAspectRatio: false,
// // // // //             scales: {
// // // // //                 y: { beginAtZero: true, grid: { display: false } },
// // // // //                 x: { grid: { display: false } }
// // // // //             },
// // // // //             plugins: { legend: { display: false } }
// // // // //         }
// // // // //     });
    
// // // // //     console.log("✅ Charts initialized successfully");
// // // // // }

// // // // // // Update WiFi data
// // // // // function updateWiFiData() {
// // // // //     const newData = wifiChart.data.datasets[0].data.map(value => {
// // // // //         const change = (Math.random() - 0.5) * 5;
// // // // //         return Math.max(-90, Math.min(-30, value + change));
// // // // //     });
// // // // //     wifiChart.data.datasets[0].data = newData;
// // // // //     wifiChart.update();
    
// // // // //     return Math.random() * 0.2 + 0.7; // Return WiFi stability score
// // // // // }

// // // // // // Update Audio data
// // // // // function updateAudioData() {
// // // // //     const newData = audioChart.data.datasets[0].data.map(value => {
// // // // //         const change = (Math.random() - 0.5) * 0.3;
// // // // //         return Math.max(0.5, Math.min(3.5, value + change));
// // // // //     });
// // // // //     audioChart.data.datasets[0].data = newData;
// // // // //     audioChart.update();
    
// // // // //     return Math.random() * 0.2 + 0.6; // Return audio consistency score
// // // // // }

// // // // // // Update Watch data
// // // // // function updateWatchData() {
// // // // //     const distance = Math.random() * 8 + 1; // 1-9 meters
// // // // //     const timestamp = new Date().toLocaleTimeString();
    
// // // // //     // Update watch chart
// // // // //     if (watchChart.data.labels.length > 8) {
// // // // //         watchChart.data.labels.shift();
// // // // //         watchChart.data.datasets[0].data.shift();
// // // // //     }
// // // // //     watchChart.data.labels.push(timestamp);
// // // // //     watchChart.data.datasets[0].data.push(distance);
// // // // //     watchChart.update();
    
// // // // //     return Math.max(0, 1 - (distance / 10)); // Return proximity score
// // // // // }

// // // // // // Update Drift data
// // // // // function updateDriftData() {
// // // // //     const drift = Math.random() * 0.3;
// // // // //     const timestamp = new Date().toLocaleTimeString();
    
// // // // //     // Update drift chart
// // // // //     if (driftChart.data.labels.length > 8) {
// // // // //         driftChart.data.labels.shift();
// // // // //         driftChart.data.datasets[0].data.shift();
// // // // //     }
// // // // //     driftChart.data.labels.push(timestamp);
// // // // //     driftChart.data.datasets[0].data.push(drift);
// // // // //     driftChart.update();
    
// // // // //     return drift; // Return drift score
// // // // // }

// // // // // // Update histogram
// // // // // function updateHistogram(decision) {
// // // // //     const index = ['ALLOW', 'CHALLENGE', 'BLOCK'].indexOf(decision);
// // // // //     if (index !== -1) {
// // // // //         histChart.data.datasets[0].data[index]++;
// // // // //         histChart.update();
// // // // //     }
// // // // // }

// // // // // // Make authentication decision
// // // // // async function makeDecision(trustScore) {
// // // // //     try {
// // // // //         const response = await fetch(`${API_BASE}/auth/decision`, {
// // // // //             method: 'POST',
// // // // //             headers: {
// // // // //                 'Content-Type': 'application/json',
// // // // //             },
// // // // //             body: JSON.stringify({
// // // // //                 user_id: 1, // Using user ID 1 for demo
// // // // //                 trust: trustScore
// // // // //             })
// // // // //         });
        
// // // // //         if (!response.ok) {
// // // // //             throw new Error(`HTTP error! status: ${response.status}`);
// // // // //         }
        
// // // // //         const data = await response.json();
        
// // // // //         // Update decisions table
// // // // //         loadDecisions();
        
// // // // //         // Update histogram
// // // // //         updateHistogram(data.result);
        
// // // // //         console.log(`✅ Decision saved: ${data.result}`);
// // // // //         return data;
        
// // // // //     } catch (error) {
// // // // //         console.error('❌ Decision error:', error);
// // // // //         // Fallback: Create decision locally if backend fails
// // // // //         let result, note;
// // // // //         if (trustScore > 0.7) {
// // // // //             result = "ALLOW";
// // // // //             note = "Normal behavior pattern";
// // // // //         } else if (trustScore > 0.4) {
// // // // //             result = "CHALLENGE";
// // // // //             note = "Additional verification required";
// // // // //         } else {
// // // // //             result = "BLOCK";
// // // // //             note = "Suspicious activity detected";
// // // // //         }
        
// // // // //         // Update histogram locally
// // // // //         updateHistogram(result);
        
// // // // //         return { result, note, trust: trustScore };
// // // // //     }
// // // // // }
// // // // // // Start streaming trust data
// // // // // function startStream() {
// // // // //     if (isStreaming) return;
    
// // // // //     console.log("▶️ Starting stream...");
// // // // //     isStreaming = true;
    
// // // // //     // Update UI
// // // // //     const statusElement = document.getElementById('status');
// // // // //     statusElement.textContent = 'active';
// // // // //     statusElement.className = 'status safe';
    
// // // // //     document.getElementById('btnStart').classList.add('ghost');
// // // // //     document.getElementById('btnStop').classList.remove('ghost');
    
// // // // //     // Clear any existing interval
// // // // //     if (updateInterval) {
// // // // //         clearInterval(updateInterval);
// // // // //     }
    
// // // // //     let counter = 0;
    
// // // // //     // Start data generation every 2 seconds
// // // // //     updateInterval = setInterval(() => {
// // // // //         if (!isStreaming) return;
        
// // // // //         counter++;
        
// // // // //         // Update all sensor data
// // // // //         const wifiScore = updateWiFiData();
// // // // //         const audioScore = updateAudioData();
// // // // //         const watchScore = updateWatchData();
// // // // //         const driftScore = updateDriftData();
        
// // // // //         // Calculate trust score (weighted average)
// // // // //         const trustScore = (wifiScore * 0.3) + (audioScore * 0.3) + (watchScore * 0.3) - (driftScore * 0.3);
// // // // //         const finalTrustScore = Math.max(0, Math.min(1, trustScore));
        
// // // // //         // Update trust score display
// // // // //         document.getElementById('trustScore').textContent = finalTrustScore.toFixed(2);
        
// // // // //         // Update trust chart
// // // // //         const now = new Date();
// // // // //         const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
        
// // // // //         if (trustChart.data.labels.length > 15) {
// // // // //             trustChart.data.labels.shift();
// // // // //             trustChart.data.datasets[0].data.shift();
// // // // //         }
// // // // //         trustChart.data.labels.push(timeLabel);
// // // // //         trustChart.data.datasets[0].data.push(finalTrustScore);
// // // // //         trustChart.update('none');
        
// // // // //         // Make decision every 10 seconds (every 5th update)
// // // // //         if (counter % 5 === 0) {
// // // // //             let result, note;
// // // // //             if (finalTrustScore > 0.7) {
// // // // //                 result = "ALLOW";
// // // // //                 note = "Normal behavior pattern";
// // // // //             } else if (finalTrustScore > 0.4) {
// // // // //                 result = "CHALLENGE";
// // // // //                 note = "Additional verification required";
// // // // //             } else {
// // // // //                 result = "BLOCK";
// // // // //                 note = "Suspicious activity detected";
// // // // //             }
            
// // // // //             // Add to decisions table
// // // // //             const tbody = document.getElementById('decisionsBody');
// // // // //             const row = document.createElement('tr');
// // // // //             const nowTime = new Date().toLocaleTimeString();
            
// // // // //             row.innerHTML = `
// // // // //                 <td>${nowTime}</td>
// // // // //                 <td>${finalTrustScore.toFixed(2)}</td>
// // // // //                 <td>${result}</td>
// // // // //                 <td>${note}</td>
// // // // //             `;
            
// // // // //             // Add to beginning of table
// // // // //             if (tbody.firstChild) {
// // // // //                 tbody.insertBefore(row, tbody.firstChild);
// // // // //             } else {
// // // // //                 tbody.appendChild(row);
// // // // //             }
            
// // // // //             // Keep only last 10 decisions
// // // // //             while (tbody.children.length > 10) {
// // // // //                 tbody.removeChild(tbody.lastChild);
// // // // //             }
            
// // // // //             // Update histogram
// // // // //             updateHistogram(result);
            
// // // // //             console.log(`Decision: ${result} (${finalTrustScore.toFixed(2)})`);
            
// // // // //             // Send to backend (optional)
// // // // //             try {
// // // // //                 fetch(`${API_BASE}/auth/decision`, {
// // // // //                     method: 'POST',
// // // // //                     headers: { 'Content-Type': 'application/json' },
// // // // //                     body: JSON.stringify({
// // // // //                         user_id: 1,
// // // // //                         trust: finalTrustScore,
// // // // //                         result: result,
// // // // //                         note: note
// // // // //                     })
// // // // //                 });
// // // // //             } catch (error) {
// // // // //                 console.log("Backend not available, continuing locally");
// // // // //             }
// // // // //         }
        
// // // // //         console.log(`Update #${counter}: ${finalTrustScore.toFixed(2)}`);
        
// // // // //     }, 2000); // Update every 2 seconds
// // // // // }

// // // // // // Stop streaming
// // // // // function stopStream() {
// // // // //     console.log("⏹️ Stopping stream...");
// // // // //     isStreaming = false;
    
// // // // //     // Update UI
// // // // //     const statusElement = document.getElementById('status');
// // // // //     statusElement.textContent = 'stopped';
// // // // //     statusElement.className = 'status';
    
// // // // //     document.getElementById('btnStart').classList.remove('ghost');
// // // // //     document.getElementById('btnStop').classList.add('ghost');
    
// // // // //     // Clear the update interval
// // // // //     if (updateInterval) {
// // // // //         clearInterval(updateInterval);
// // // // //         updateInterval = null;
// // // // //     }
// // // // // }



// // // // // // Initialize when page loads
// // // // // document.addEventListener('DOMContentLoaded', function() {
// // // // //     console.log("🚀 DOM loaded, initializing...");
    
// // // // //     // Check if Chart.js is available
// // // // //     if (typeof Chart === 'undefined') {
// // // // //         console.error("❌ Chart.js not loaded! Add: <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>");
// // // // //         return;
// // // // //     }
    
// // // // //     // Initialize charts
// // // // //     initCharts();
    
// // // // //     // Add event listeners to buttons
// // // // //     const startBtn = document.getElementById('btnStart');
// // // // //     const stopBtn = document.getElementById('btnStop');
    
// // // // //     if (startBtn && stopBtn) {
// // // // //         startBtn.addEventListener('click', startStream);
// // // // //         stopBtn.addEventListener('click', stopStream);
// // // // //         console.log("✅ Button listeners added");
        
// // // // //         // Set initial button states
// // // // //         stopBtn.classList.add('ghost');
// // // // //     } else {
// // // // //         console.error("❌ Buttons not found!");
// // // // //     }
    
// // // // //     console.log("✅ System ready - click 'Start Stream' to begin");
// // // // // });

// // // // const API_BASE = "http://127.0.0.1:5000/api";
// // // // let isStreaming = false;
// // // // let updateInterval;
// // // // let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;
// // // // let currentUser = null;


// // // // // Debug authentication status
// // // // console.log('=== AUTHENTICATION DEBUG ===');
// // // // console.log('Token exists:', !!localStorage.getItem('authToken'));
// // // // console.log('User ID:', localStorage.getItem('userId'));
// // // // console.log('Username:', localStorage.getItem('username'));
// // // // console.log('Current URL:', window.location.href);
// // // // console.log('============================');


// // // // // Check authentication and redirect if not logged in
// // // // function checkAuth() {
// // // //     const token = localStorage.getItem('authToken');
// // // //     const userId = localStorage.getItem('userId');
    
// // // //     if (!token || !userId) {
// // // //         console.log('❌ Not authenticated, redirecting to login');
// // // //         window.location.href = '/login.html';
// // // //         return false;
// // // //     }
    
// // // //     console.log('✅ Authentication check passed');
// // // //     return true;
// // // // }

// // // // // Get user profile
// // // // async function getUserProfile() {
// // // //     const token = localStorage.getItem('authToken');
    
// // // //     try {
// // // //         const response = await fetch(`${API_BASE}/auth/profile`, {
// // // //             headers: {
// // // //                 'Authorization': `Bearer ${token}`
// // // //             }
// // // //         });
        
// // // //         if (response.ok) {
// // // //             currentUser = await response.json();
// // // //             console.log('✅ User profile loaded:', currentUser.username);
// // // //             updateUserInterface();
// // // //             return true;
// // // //         } else {
// // // //             console.error('❌ Failed to get user profile');
// // // //             // Clear invalid token and redirect to login
// // // //             localStorage.removeItem('authToken');
// // // //             localStorage.removeItem('userId');
// // // //             localStorage.removeItem('username');
// // // //             window.location.href = '/login.html';
// // // //             return false;
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('❌ Error getting profile:', error);
// // // //         localStorage.removeItem('authToken');
// // // //         localStorage.removeItem('userId');
// // // //         localStorage.removeItem('username');
// // // //         window.location.href = '/login.html';
// // // //         return false;
// // // //     }
// // // // }

// // // // // Update UI with user info
// // // // function updateUserInterface() {
// // // //     if (currentUser) {
// // // //         // Update user info in the sidebar
// // // //         const userElement = document.getElementById('user');
// // // //         const deviceElement = document.getElementById('device');
        
// // // //         if (userElement) userElement.textContent = currentUser.username;
// // // //         if (deviceElement) deviceElement.textContent = currentUser.device || 'Unknown Device';
        
// // // //         console.log('✅ UI updated with user info');
// // // //     }
// // // // }

// // // // // Logout function
// // // // function logout() {
// // // //     if (confirm('Are you sure you want to logout?')) {
// // // //         localStorage.removeItem('authToken');
// // // //         localStorage.removeItem('userId');
// // // //         localStorage.removeItem('username');
// // // //         window.location.href = '/login.html';
// // // //     }
// // // // }

// // // // // Initialize when page loads
// // // // document.addEventListener('DOMContentLoaded', async function() {
// // // //     console.log('🚀 Initializing user dashboard...');
    
// // // //     // Check authentication first
// // // //     if (!checkAuth()) {
// // // //         return; // Redirect will happen automatically
// // // //     }
    
// // // //     // Get user profile
// // // //     const authenticated = await getUserProfile();
// // // //     if (!authenticated) {
// // // //         return; // Redirect will happen automatically
// // // //     }
    
// // // //     // Now initialize the rest of the application
// // // //     console.log('✅ Starting dashboard for user:', currentUser.username);
    
// // // //     // Initialize charts
// // // //     initCharts();
    
// // // //     // Load initial decisions
// // // //     loadDecisions();
    
// // // //     // Add event listeners
// // // //     document.getElementById('btnStart').addEventListener('click', startStream);
// // // //     document.getElementById('btnStop').addEventListener('click', stopStream);
    
// // // //     // Add logout button if it exists
// // // //     const logoutBtn = document.getElementById('btnLogout');
// // // //     if (logoutBtn) {
// // // //         logoutBtn.addEventListener('click', logout);
// // // //     }
    
// // // //     // Set initial button states
// // // //     document.getElementById('btnStop').classList.add('ghost');
    
// // // //     console.log('✅ Dashboard fully initialized');
// // // // });

// // // // // ... rest of your existing functions (initCharts, loadDecisions, etc.) remain the same
// // // // // Login function
// // // // async function login(username, password) {
// // // //     try {
// // // //         const response = await fetch(`${API_BASE}/auth/login`, {
// // // //             method: 'POST',
// // // //             headers: {
// // // //                 'Content-Type': 'application/json'
// // // //             },
// // // //             body: JSON.stringify({
// // // //                 username: username,
// // // //                 password: password,
// // // //                 device: navigator.userAgent.substring(0, 50) // Truncate if too long
// // // //             })
// // // //         });
        
// // // //         const data = await response.json();
        
// // // //         if (response.ok) {
// // // //             authToken = data.token;
// // // //             localStorage.setItem('authToken', authToken);
// // // //             localStorage.setItem('userId', data.user_id);
// // // //             localStorage.setItem('username', data.username);
            
// // // //             currentUser = {
// // // //                 user_id: data.user_id,
// // // //                 username: data.username,
// // // //                 device: data.device
// // // //             };
            
// // // //             window.location.href = '/';
// // // //         } else {
// // // //             alert('Login failed: ' + data.error);
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('Login error:', error);
// // // //         alert('Login failed. Please try again.');
// // // //     }
// // // // }

// // // // // Logout function
// // // // function logout() {
// // // //     localStorage.removeItem('authToken');
// // // //     localStorage.removeItem('userId');
// // // //     localStorage.removeItem('username');
// // // //     window.location.href = '/login.html';
// // // // }

// // // // // Make authentication decision with proper user context
// // // // async function makeDecision(trustScore) {
// // // //     if (!currentUser) return;
    
// // // //     try {
// // // //         const response = await fetch(`${API_BASE}/auth/decision`, {
// // // //             method: 'POST',
// // // //             headers: {
// // // //                 'Content-Type': 'application/json',
// // // //                 'Authorization': `Bearer ${authToken}`
// // // //             },
// // // //             body: JSON.stringify({
// // // //                 user_id: currentUser.user_id,
// // // //                 trust: trustScore
// // // //             })
// // // //         });
        
// // // //         if (!response.ok) {
// // // //             throw new Error(`HTTP error! status: ${response.status}`);
// // // //         }
        
// // // //         const data = await response.json();
        
// // // //         // Update decisions table
// // // //         loadDecisions();
        
// // // //         // Update histogram
// // // //         updateHistogram(data.result);
        
// // // //         console.log(`✅ Decision saved for ${currentUser.username}: ${data.result}`);
// // // //         return data;
        
// // // //     } catch (error) {
// // // //         console.error('❌ Decision error:', error);
// // // //         // Fallback: Create decision locally if backend fails
// // // //         let result, note;
// // // //         if (trustScore > 0.7) {
// // // //             result = "ALLOW";
// // // //             note = "Normal behavior pattern";
// // // //         } else if (trustScore > 0.4) {
// // // //             result = "CHALLENGE";
// // // //             note = "Additional verification required";
// // // //         } else {
// // // //             result = "BLOCK";
// // // //             note = "Suspicious activity detected";
// // // //         }
        
// // // //         // Update histogram locally
// // // //         updateHistogram(result);
        
// // // //         return { result, note, trust: trustScore };
// // // //     }
// // // // }

// // // // // Load decisions for current user
// // // // async function loadDecisions() {
// // // //     if (!currentUser) return;
    
// // // //     try {
// // // //         const response = await fetch(`${API_BASE}/user/decisions/${currentUser.user_id}`, {
// // // //             headers: {
// // // //                 'Authorization': `Bearer ${authToken}`
// // // //             }
// // // //         });
        
// // // //         if (response.ok) {
// // // //             const decisions = await response.json();
// // // //             const tbody = document.getElementById('decisionsBody');
// // // //             tbody.innerHTML = '';
            
// // // //             decisions.forEach(d => {
// // // //                 const row = document.createElement('tr');
// // // //                 row.innerHTML = `
// // // //                     <td>${new Date(d.timestamp).toLocaleString()}</td>
// // // //                     <td>${d.trust.toFixed(2)}</td>
// // // //                     <td>${d.result}</td>
// // // //                     <td>${d.note || ''}</td>
// // // //                 `;
// // // //                 tbody.appendChild(row);
// // // //             });
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('Error loading decisions:', error);
// // // //     }
// // // // }

// // // // // ... (rest of your existing chart functions remain the same)

// // // // // Initialize when page loads
// // // // document.addEventListener('DOMContentLoaded', async function() {
// // // //     // Check authentication
// // // //     if (!checkAuth()) return;
    
// // // //     // Get user profile
// // // //     const authenticated = await getUserProfile();
// // // //     if (!authenticated) return;
    
// // // //     // Initialize charts
// // // //     initCharts();
    
// // // //     // Load initial decisions
// // // //     loadDecisions();
    
// // // //     // Add event listeners
// // // //     document.getElementById('btnStart').addEventListener('click', startStream);
// // // //     document.getElementById('btnStop').addEventListener('click', stopStream);
// // // //     document.getElementById('btnLogout').addEventListener('click', logout);
    
// // // //     // Set initial button states
// // // //     document.getElementById('btnStop').classList.add('ghost');
    
// // // //     console.log(`✅ System ready for user: ${currentUser.username}`);
// // // // });

// // // const API_BASE = "http://127.0.0.1:5000/api";
// // // let isStreaming = false;
// // // let updateInterval;
// // // let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;
// // // let currentUser = null;

// // // // Check authentication and redirect if not logged in
// // // function checkAuth() {
// // //     const token = localStorage.getItem('authToken');
// // //     const userId = localStorage.getItem('userId');
    
// // //     if (!token || !userId) {
// // //         console.log('❌ Not authenticated, redirecting to login');
// // //         window.location.href = '/login.html';
// // //         return false;
// // //     }
    
// // //     console.log('✅ Authentication check passed');
// // //     return true;
// // // }

// // // // Get user profile
// // // async function getUserProfile() {
// // //     const token = localStorage.getItem('authToken');
    
// // //     try {
// // //         const response = await fetch(`${API_BASE}/auth/profile`, {
// // //             headers: {
// // //                 'Authorization': `Bearer ${token}`
// // //             }
// // //         });
        
// // //         if (response.ok) {
// // //             currentUser = await response.json();
// // //             console.log('✅ User profile loaded:', currentUser.username);
// // //             updateUserInterface();
// // //             return true;
// // //         } else {
// // //             console.error('❌ Failed to get user profile');
// // //             // Clear invalid token and redirect to login
// // //             localStorage.removeItem('authToken');
// // //             localStorage.removeItem('userId');
// // //             localStorage.removeItem('username');
// // //             window.location.href = '/login.html';
// // //             return false;
// // //         }
// // //     } catch (error) {
// // //         console.error('❌ Error getting profile:', error);
// // //         localStorage.removeItem('authToken');
// // //         localStorage.removeItem('userId');
// // //         localStorage.removeItem('username');
// // //         window.location.href = '/login.html';
// // //         return false;
// // //     }
// // // }

// // // // Update UI with user info
// // // function updateUserInterface() {
// // //     if (currentUser) {
// // //         // Update user info in the sidebar
// // //         const userElement = document.getElementById('user');
// // //         const deviceElement = document.getElementById('device');
// // //         const welcomeElement = document.getElementById('userWelcome');
        
// // //         if (userElement) userElement.textContent = currentUser.username;
// // //         if (deviceElement) deviceElement.textContent = currentUser.device || 'Unknown Device';
// // //         if (welcomeElement) welcomeElement.textContent = `Welcome, ${currentUser.username}`;
        
// // //         console.log('✅ UI updated with user info');
// // //     }
// // // }

// // // // Initialize all charts
// // // function initCharts() {
// // //     console.log("📊 Initializing charts...");
    
// // //     // Trust Score Chart
// // //     trustChart = new Chart(document.getElementById('trustChart'), {
// // //         type: 'line',
// // //         data: {
// // //             labels: [],
// // //             datasets: [{
// // //                 label: 'Trust Score',
// // //                 data: [],
// // //                 borderColor: '#24d27b',
// // //                 tension: 0.4,
// // //                 fill: false,
// // //                 pointRadius: 3,
// // //                 borderWidth: 2
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: {
// // //                     beginAtZero: true,
// // //                     max: 1,
// // //                     grid: { display: false }
// // //                 },
// // //                 x: { display: false }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });

// // //     // WiFi RSSI Chart
// // //     wifiChart = new Chart(document.getElementById('wifiChart'), {
// // //         type: 'bar',
// // //         data: {
// // //             labels: ['AP-1', 'AP-2', 'AP-3', 'AP-4', 'AP-5'],
// // //             datasets: [{
// // //                 data: [-45, -52, -60, -65, -70],
// // //                 backgroundColor: '#4f79bc',
// // //                 borderWidth: 0
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: { 
// // //                     reverse: true,
// // //                     min: -90,
// // //                     max: -30,
// // //                     grid: { display: false }
// // //                 }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });

// // //     // Audio MFCC Chart
// // //     audioChart = new Chart(document.getElementById('audioChart'), {
// // //         type: 'line',
// // //         data: {
// // //             labels: Array.from({length: 13}, (_, i) => `M${i+1}`),
// // //             datasets: [{
// // //                 data: Array(13).fill(0).map(() => Math.random() * 2 + 1),
// // //                 borderColor: '#bc4f7d',
// // //                 tension: 0.4,
// // //                 fill: false,
// // //                 borderWidth: 2
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: { 
// // //                     min: 0,
// // //                     max: 4,
// // //                     grid: { display: false }
// // //                 },
// // //                 x: { grid: { display: false } }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });

// // //     // Watch Proximity Chart
// // //     watchChart = new Chart(document.getElementById('watchChart'), {
// // //         type: 'line',
// // //         data: {
// // //             labels: [],
// // //             datasets: [{
// // //                 label: 'Distance (m)',
// // //                 data: [],
// // //                 borderColor: '#4fbca9',
// // //                 tension: 0.4,
// // //                 fill: false,
// // //                 pointRadius: 2,
// // //                 borderWidth: 2
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: {
// // //                     min: 0,
// // //                     max: 10,
// // //                     grid: { display: false }
// // //                 },
// // //                 x: { display: false }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });

// // //     // Feature Drift Chart
// // //     driftChart = new Chart(document.getElementById('driftChart'), {
// // //         type: 'line',
// // //         data: {
// // //             labels: [],
// // //             datasets: [{
// // //                 label: 'Drift Score',
// // //                 data: [],
// // //                 borderColor: '#d27b24',
// // //                 tension: 0.4,
// // //                 fill: false,
// // //                 pointRadius: 2,
// // //                 borderWidth: 2
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: {
// // //                     min: 0,
// // //                     max: 1,
// // //                     grid: { display: false }
// // //                 },
// // //                 x: { display: false }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });

// // //     // Decision Histogram
// // //     histChart = new Chart(document.getElementById('histChart'), {
// // //         type: 'bar',
// // //         data: {
// // //             labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
// // //             datasets: [{
// // //                 data: [0, 0, 0],
// // //                 backgroundColor: ['#24d27b', '#d2b624', '#d22424'],
// // //                 borderWidth: 0
// // //             }]
// // //         },
// // //         options: {
// // //             responsive: true,
// // //             maintainAspectRatio: false,
// // //             scales: {
// // //                 y: { beginAtZero: true, grid: { display: false } },
// // //                 x: { grid: { display: false } }
// // //             },
// // //             plugins: { legend: { display: false } }
// // //         }
// // //     });
    
// // //     console.log("✅ Charts initialized successfully");
// // // }

// // // // Update sensor data charts
// // // function updateSensorData() {
// // //     // Update WiFi data
// // //     const newWiFiData = wifiChart.data.datasets[0].data.map(value => {
// // //         const change = (Math.random() - 0.5) * 5;
// // //         return Math.max(-90, Math.min(-30, value + change));
// // //     });
// // //     wifiChart.data.datasets[0].data = newWiFiData;
// // //     wifiChart.update();

// // //     // Update Audio data
// // //     const newAudioData = audioChart.data.datasets[0].data.map(value => {
// // //         const change = (Math.random() - 0.5) * 0.3;
// // //         return Math.max(0.5, Math.min(3.5, value + change));
// // //     });
// // //     audioChart.data.datasets[0].data = newAudioData;
// // //     audioChart.update();

// // //     // Update Watch data
// // //     const distance = Math.random() * 8 + 1;
// // //     const timestamp = new Date().toLocaleTimeString();
    
// // //     if (watchChart.data.labels.length > 8) {
// // //         watchChart.data.labels.shift();
// // //         watchChart.data.datasets[0].data.shift();
// // //     }
// // //     watchChart.data.labels.push(timestamp);
// // //     watchChart.data.datasets[0].data.push(distance);
// // //     watchChart.update();

// // //     // Update Drift data
// // //     const drift = Math.random() * 0.3;
// // //     if (driftChart.data.labels.length > 8) {
// // //         driftChart.data.labels.shift();
// // //         driftChart.data.datasets[0].data.shift();
// // //     }
// // //     driftChart.data.labels.push(timestamp);
// // //     driftChart.data.datasets[0].data.push(drift);
// // //     driftChart.update();

// // //     return {
// // //         wifiStability: Math.random() * 0.2 + 0.7,
// // //         audioConsistency: Math.random() * 0.2 + 0.6,
// // //         watchProximity: Math.max(0, 1 - (distance / 10)),
// // //         featureDrift: drift
// // //     };
// // // }

// // // // Update histogram
// // // function updateHistogram(decision) {
// // //     const index = ['ALLOW', 'CHALLENGE', 'BLOCK'].indexOf(decision);
// // //     if (index !== -1) {
// // //         histChart.data.datasets[0].data[index]++;
// // //         histChart.update();
// // //     }
// // // }

// // // // WiFi scanning functions
// // // async function scanWiFi() {
// // //     try {
// // //         const response = await fetch(`${API_BASE}/user/wifi/scan`, {
// // //             headers: {
// // //                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
// // //             }
// // //         });
        
// // //         if (response.ok) {
// // //             const data = await response.json();
// // //             console.log('📡 WiFi scan results:', data);
// // //             updateWiFiChart(data.access_points);
// // //             return data.access_points;
// // //         }
// // //     } catch (error) {
// // //         console.error('WiFi scan error:', error);
// // //     }
// // //     return [];
// // // }

// // // async function getWiFiStability() {
// // //     try {
// // //         const response = await fetch(`${API_BASE}/user/wifi/stability`, {
// // //             headers: {
// // //                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
// // //             }
// // //         });
        
// // //         if (response.ok) {
// // //             const data = await response.json();
// // //             console.log('📊 WiFi stability:', data);
// // //             return data.stability_score;
// // //         }
// // //     } catch (error) {
// // //         console.error('WiFi stability error:', error);
// // //     }
// // //     return 0.5; // Default neutral score
// // // }

// // // function updateWiFiChart(accessPoints) {
// // //     if (!wifiChart || !accessPoints.length) return;
    
// // //     // Sort by signal strength and take top 5
// // //     const topAPs = accessPoints
// // //         .sort((a, b) => b.signal - a.signal)
// // //         .slice(0, 5);
    
// // //     // Update chart data
// // //     wifiChart.data.labels = topAPs.map(ap => ap.ssid.substring(0, 10) + '...');
// // //     wifiChart.data.datasets[0].data = topAPs.map(ap => ap.signal);
    
// // //     wifiChart.update();
// // // }

// // // // Modify your existing sensor data function to include real WiFi data
// // // async function updateSensorData() {
// // //     let wifiStability = 0.5;
    
// // //     // Get real WiFi data if available
// // //     try {
// // //         wifiStability = await getWiFiStability();
// // //         await scanWiFi(); // Update WiFi chart
// // //     } catch (error) {
// // //         console.log('Using simulated WiFi data');
// // //         // Fallback to simulated data
// // //         const newWiFiData = wifiChart.data.datasets[0].data.map(value => {
// // //             const change = (Math.random() - 0.5) * 5;
// // //             return Math.max(-90, Math.min(-30, value + change));
// // //         });
// // //         wifiChart.data.datasets[0].data = newWiFiData;
// // //         wifiChart.update();
        
// // //         // Simulate stability based on signal variance
// // //         const variance = Math.random() * 0.3;
// // //         wifiStability = Math.max(0, 1 - variance);
// // //     }
    
// // //     // Rest of your existing sensor updates...
// // //     const audioConsistency = Math.random() * 0.2 + 0.6;
// // //     const distance = Math.random() * 8 + 1;
// // //     const watchProximity = Math.max(0, 1 - (distance / 10));
// // //     const drift = Math.random() * 0.3;
    
// // //     // Update other charts...
// // //     updateOtherCharts(distance, drift);
    
// // //     return {
// // //         wifiStability: wifiStability,
// // //         audioConsistency: audioConsistency,
// // //         watchProximity: watchProximity,
// // //         featureDrift: drift
// // //     };
// // // }

// // // function updateOtherCharts(distance, drift) {
// // //     // Update watch chart
// // //     const timestamp = new Date().toLocaleTimeString();
// // //     if (watchChart.data.labels.length > 8) {
// // //         watchChart.data.labels.shift();
// // //         watchChart.data.datasets[0].data.shift();
// // //     }
// // //     watchChart.data.labels.push(timestamp);
// // //     watchChart.data.datasets[0].data.push(distance);
// // //     watchChart.update();

// // //     // Update drift chart
// // //     if (driftChart.data.labels.length > 8) {
// // //         driftChart.data.labels.shift();
// // //         driftChart.data.datasets[0].data.shift();
// // //     }
// // //     driftChart.data.labels.push(timestamp);
// // //     driftChart.data.datasets[0].data.push(drift);
// // //     driftChart.update();
// // // }
// // // // REPLACE your existing updateTrustScore function with this debug version
// // // async function updateTrustScore() {
// // //     try {
// // //         const behavioralData = collectBehavioralData();
        
// // //         // ADD DEBUG LOGGING HERE
// // //         console.log('Behavioral data being sent:', behavioralData);
        
// // //         const response = await fetch('/api/trust/score', {
// // //             method: 'POST',
// // //             headers: {
// // //                 'Content-Type': 'application/json',
// // //                 'Authorization': `Bearer ${getAuthToken()}`
// // //             },
// // //             body: JSON.stringify({
// // //                 user_id: getCurrentUserId(),
// // //                 behavioral_data: behavioralData
// // //             })
// // //         });
        
// // //         // ADD RESPONSE DEBUGGING
// // //         console.log('Response status:', response.status);
        
// // //         if (response.ok) {
// // //             const data = await response.json();
// // //             console.log('Trust score response:', data); // ADD THIS LINE
            
// // //             // ADD VALIDATION
// // //             if (data.trust_score !== undefined && data.trust_score !== null) {
// // //                 updateTrustUI(data.trust_score);
// // //             } else {
// // //                 console.error('Invalid trust score received:', data);
// // //                 updateTrustUI(0.5);
// // //             }
// // //         } else {
// // //             console.error('Trust score API error:', response.status);
// // //             const errorText = await response.text();
// // //             console.error('Error response:', errorText);
// // //             updateTrustUI(0.5);
// // //         }
// // //     } catch (error) {
// // //         console.error('Trust score update failed:', error);
// // //         updateTrustUI(0.5);
// // //     }
// // // }

// // // // ENHANCE your updateTrustUI function with NaN protection
// // // function updateTrustUI(score) {
// // //     const trustElement = document.getElementById('trust-score');
// // //     const gaugeElement = document.getElementById('trust-gauge');
    
// // //     // ADD NaN CHECK
// // //     if (isNaN(score) || score === null || score === undefined) {
// // //         console.warn('Invalid score received, using default:', score);
// // //         score = 0.5;
// // //     }
    
// // //     if (trustElement) {
// // //         trustElement.textContent = score.toFixed(2);
// // //     }
    
// // //     if (gaugeElement) {
// // //         gaugeElement.style.width = `${score * 100}%`;
// // //     }
// // // }

// // // // ADD A TEST FUNCTION TO CHECK IF THE API IS WORKING
// // // async function testTrustAPI() {
// // //     console.log('Testing trust API...');
    
// // //     const testData = {
// // //         user_id: 'test_user',
// // //         behavioral_data: {
// // //             typing_metrics: { speed: 45, rhythm: 0.7 },
// // //             mouse_metrics: { speed: 95, accuracy: 0.8 },
// // //             context: { ip: '192.168.1.1', time_of_day: 14 }
// // //         }
// // //     };
    
// // //     try {
// // //         const response = await fetch('/api/trust/score', {
// // //             method: 'POST',
// // //             headers: {'Content-Type': 'application/json'},
// // //             body: JSON.stringify(testData)
// // //         });
        
// // //         const result = await response.json();
// // //         console.log('Test API result:', result);
// // //         return result;
// // //     } catch (error) {
// // //         console.error('Test API failed:', error);
// // //     }
// // // }

// // // // Call this in your browser console to test
// // // // testTrustAPI();
// // // // Make authentication decision
// // // async function makeDecision(trustScore) {
// // //     if (!currentUser) return;
    
// // //     try {
// // //         const response = await fetch(`${API_BASE}/auth/decision`, {
// // //             method: 'POST',
// // //             headers: {
// // //                 'Content-Type': 'application/json',
// // //                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
// // //             },
// // //             body: JSON.stringify({
// // //                 user_id: currentUser.user_id,
// // //                 trust: trustScore
// // //             })
// // //         });
        
// // //         if (!response.ok) throw new Error('API request failed');
        
// // //         const data = await response.json();
// // //         addDecisionToTable(trustScore, data.result, data.note);
// // //         updateHistogram(data.result);
        
// // //         console.log(`✅ Decision saved: ${data.result}`);
// // //         return data;
        
// // //     } catch (error) {
// // //         console.error('❌ Decision error:', error);
// // //         // Fallback
// // //         let result, note;
// // //         if (trustScore > 0.7) {
// // //             result = "ALLOW";
// // //             note = "Normal behavior pattern";
// // //         } else if (trustScore > 0.4) {
// // //             result = "CHALLENGE";
// // //             note = "Additional verification required";
// // //         } else {
// // //             result = "BLOCK";
// // //             note = "Suspicious activity detected";
// // //         }
        
// // //         addDecisionToTable(trustScore, result, note);
// // //         updateHistogram(result);
        
// // //         return { result, note, trust: trustScore };
// // //     }
// // // }

// // // // Add decision to table
// // // function addDecisionToTable(trust, result, note) {
// // //     const tbody = document.getElementById('decisionsBody');
    
// // //     // Remove "no decisions" message
// // //     if (tbody.children.length === 1 && tbody.children[0].cells.length === 1) {
// // //         tbody.innerHTML = '';
// // //     }
    
// // //     const row = document.createElement('tr');
    
// // //     // Add class based on decision result
// // //     let decisionClass = '';
// // //     if (result === 'ALLOW') decisionClass = 'decision-allow';
// // //     else if (result === 'CHALLENGE') decisionClass = 'decision-challenge';
// // //     else if (result === 'BLOCK') decisionClass = 'decision-block';
    
// // //     row.innerHTML = `
// // //         <td>${new Date().toLocaleTimeString()}</td>
// // //         <td>${trust.toFixed(2)}</td>
// // //         <td class="${decisionClass}">${result}</td>
// // //         <td>${note}</td>
// // //     `;
    
// // //     tbody.insertBefore(row, tbody.firstChild);
    
// // //     // Keep only last 10 decisions
// // //     while (tbody.children.length > 10) {
// // //         tbody.removeChild(tbody.lastChild);
// // //     }
// // // }

// // // // Start streaming trust data
// // // function startStream() {
// // //     if (isStreaming) return;
    
// // //     console.log("▶️ Starting stream...");
// // //     isStreaming = true;
    
// // //     // Update UI
// // //     const statusElement = document.getElementById('status');
// // //     statusElement.textContent = 'active';
// // //     statusElement.className = 'status safe';
    
// // //     document.getElementById('btnStart').classList.add('ghost');
// // //     document.getElementById('btnStop').classList.remove('ghost');
    
// // //     // Clear any existing interval
// // //     if (updateInterval) {
// // //         clearInterval(updateInterval);
// // //     }
    
// // //     let counter = 0;
    
// // //     // Start data generation every 2 seconds
// // //     updateInterval = setInterval(() => {
// // //         if (!isStreaming) return;
        
// // //         counter++;
        
// // //         // Update all sensor data
// // //         const sensorData = updateSensorData();
        
// // //         // Calculate trust score (weighted average)
// // //         const trustScore = (sensorData.wifiStability * 0.3) + 
// // //                           (sensorData.audioConsistency * 0.3) + 
// // //                           (sensorData.watchProximity * 0.3) - 
// // //                           (sensorData.featureDrift * 0.3);
        
// // //         const finalTrustScore = Math.max(0, Math.min(1, trustScore));
        
// // //         // Update trust score display with animation
// // //         const trustElement = document.getElementById('trustScore');
// // //         trustElement.textContent = finalTrustScore.toFixed(2);
// // //         trustElement.classList.add('trust-pulse');
// // //         setTimeout(() => trustElement.classList.remove('trust-pulse'), 500);
        
// // //         // Update trust chart
// // //         const now = new Date();
// // //         const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
        
// // //         if (trustChart.data.labels.length > 15) {
// // //             trustChart.data.labels.shift();
// // //             trustChart.data.datasets[0].data.shift();
// // //         }
// // //         trustChart.data.labels.push(timeLabel);
// // //         trustChart.data.datasets[0].data.push(finalTrustScore);
// // //         trustChart.update('none');
        
// // //         // Make authentication decision every 10 seconds (every 5th update)
// // //         if (counter % 5 === 0) {
// // //             makeDecision(finalTrustScore);
// // //         }
        
// // //     }, 2000); // Update every 2 seconds
// // // }

// // // // Stop streaming
// // // function stopStream() {
// // //     console.log("⏹️ Stopping stream...");
// // //     isStreaming = false;
    
// // //     // Update UI
// // //     const statusElement = document.getElementById('status');
// // //     statusElement.textContent = 'stopped';
// // //     statusElement.className = 'status';
    
// // //     document.getElementById('btnStart').classList.remove('ghost');
// // //     document.getElementById('btnStop').classList.add('ghost');
    
// // //     // Clear the update interval
// // //     if (updateInterval) {
// // //         clearInterval(updateInterval);
// // //         updateInterval = null;
// // //     }
// // // }

// // // // Logout function
// // // function logout() {
// // //     if (confirm('Are you sure you want to logout?')) {
// // //         localStorage.removeItem('authToken');
// // //         localStorage.removeItem('userId');
// // //         localStorage.removeItem('username');
// // //         window.location.href = '/login.html';
// // //     }
// // // }

// // // // Initialize when page loads
// // // document.addEventListener('DOMContentLoaded', async function() {
// // //     console.log("🚀 User dashboard loaded");
    
// // //     // Check authentication first
// // //     if (!checkAuth()) {
// // //         return; // Redirect will happen automatically
// // //     }
    
// // //     // Get user profile
// // //     const authenticated = await getUserProfile();
// // //     if (!authenticated) {
// // //         return; // Redirect will happen automatically
// // //     }
    
// // //     // Now initialize the rest of the application
// // //     console.log("✅ Starting dashboard for user:", currentUser.username);
    
// // //     // Initialize charts
// // //     initCharts();
    
// // //     // Add event listeners
// // //     document.getElementById('btnStart').addEventListener('click', startStream);
// // //     document.getElementById('btnStop').addEventListener('click', stopStream);
// // //     document.getElementById('btnLogout').addEventListener('click', logout);
    
// // //     // Set initial button states
// // //     document.getElementById('btnStop').classList.add('ghost');
    
// // //     console.log("✅ Dashboard fully initialized");
// // // });

// // const API_BASE = "http://127.0.0.1:5000/api";
// // let isStreaming = false;
// // let updateInterval;
// // let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;
// // let currentUser = null;


// // // Debug authentication status
// // console.log('=== AUTHENTICATION DEBUG ===');
// // console.log('Token exists:', !!localStorage.getItem('authToken'));
// // console.log('User ID:', localStorage.getItem('userId'));
// // console.log('Username:', localStorage.getItem('username'));
// // console.log('Current URL:', window.location.href);
// // console.log('============================');


// // // Helper functions that were missing
// // function getAuthToken() {
// //     return localStorage.getItem('authToken');
// // }

// // function getCurrentUserId() {
// //     return localStorage.getItem('userId');
// // }

// // function getCurrentUsername() {
// //     return localStorage.getItem('username');
// // }

// // // Simple behavioral data collection (mock for now)
// // function collectBehavioralData() {
// //     return {
// //         typing_metrics: { 
// //             speed: Math.random() * 50 + 30, 
// //             rhythm: Math.random() * 0.5 + 0.5 
// //         },
// //         mouse_metrics: { 
// //             speed: Math.random() * 50 + 50, 
// //             accuracy: Math.random() * 0.3 + 0.7 
// //         },
// //         context: { 
// //             time_of_day: new Date().getHours(),
// //             user_agent: navigator.userAgent 
// //         }
// //     };
// // }

// // // Check authentication and redirect if not logged in
// // function checkAuth() {
// //     const token = getAuthToken();
// //     const userId = getCurrentUserId();
    
// //     console.log('🔐 Auth check - Token:', token ? 'Present' : 'Missing', 'User ID:', userId);
    
// //     if (!token || !userId) {
// //         console.log('❌ Not authenticated, redirecting to login');
// //         window.location.href = '/login.html';
// //         return false;
// //     }
    
// //     console.log('✅ Authentication check passed');
// //     return true;
// // }

// // // Get user profile - SIMPLIFIED to avoid API calls that don't exist
// // async function getUserProfile() {
// //     // Use stored data instead of making API call to /auth/profile
// //     const username = getCurrentUsername();
// //     const userId = getCurrentUserId();
    
// //     if (username && userId) {
// //         currentUser = {
// //             user_id: parseInt(userId),
// //             username: username,
// //             device: 'Current Device'
// //         };
// //         console.log('✅ User profile loaded from storage:', currentUser.username);
// //         updateUserInterface();
// //         return true;
// //     } else {
// //         console.error('❌ No user data in storage');
// //         logout();
// //         return false;
// //     }
// // }

// // // Update UI with user info
// // function updateUserInterface() {
// //     if (currentUser) {
// //         const userElement = document.getElementById('user');
// //         const deviceElement = document.getElementById('device');
// //         const welcomeElement = document.getElementById('userWelcome');
        
// //         if (userElement) userElement.textContent = currentUser.username;
// //         if (deviceElement) deviceElement.textContent = currentUser.device || 'Unknown Device';
// //         if (welcomeElement) welcomeElement.textContent = `Welcome, ${currentUser.username}`;
        
// //         console.log('✅ UI updated with user info');
// //     }
// // }

// // // Initialize all charts
// // function initCharts() {
// //     console.log("📊 Initializing charts...");
    
// //     // Trust Score Chart
// //     const trustCtx = document.getElementById('trustChart');
// //     if (trustCtx) {
// //         trustChart = new Chart(trustCtx, {
// //             type: 'line',
// //             data: {
// //                 labels: [],
// //                 datasets: [{
// //                     label: 'Trust Score',
// //                     data: [],
// //                     borderColor: '#24d27b',
// //                     tension: 0.4,
// //                     fill: false,
// //                     pointRadius: 3,
// //                     borderWidth: 2
// //                 }]
// //             },
// //             options: {
// //                 responsive: true,
// //                 maintainAspectRatio: false,
// //                 scales: {
// //                     y: {
// //                         beginAtZero: true,
// //                         max: 1,
// //                         grid: { display: false }
// //                     },
// //                     x: { display: false }
// //                 },
// //                 plugins: { legend: { display: false } }
// //             }
// //         });
// //     }

// //     // Initialize other charts similarly but simplified for now
// //     console.log("✅ Charts initialized successfully");
// // }

// // // Update trust score with proper error handling
// // async function updateTrustScore() {
// //     try {
// //         const behavioralData = collectBehavioralData();
        
// //         console.log('📊 Behavioral data being sent:', behavioralData);
        
// //         const response = await fetch('/api/trust/score', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify({
// //                 user_id: getCurrentUserId(),
// //                 behavioral_data: behavioralData
// //             })
// //         });
        
// //         console.log('📡 Response status:', response.status);
        
// //         if (response.ok) {
// //             const data = await response.json();
// //             console.log('✅ Trust score response:', data);
            
// //             if (data.trust_score !== undefined && data.trust_score !== null) {
// //                 updateTrustUI(data.trust_score);
// //                 return data.trust_score;
// //             } else {
// //                 console.error('❌ Invalid trust score received:', data);
// //                 updateTrustUI(0.7); // Default safe score
// //                 return 0.7;
// //             }
// //         } else {
// //             console.error('❌ Trust score API error:', response.status);
// //             // Use mock data when API fails
// //             const mockScore = 0.7 + (Math.random() * 0.3 - 0.15); // 0.55-0.85
// //             updateTrustUI(mockScore);
// //             return mockScore;
// //         }
// //     } catch (error) {
// //         console.error('❌ Trust score update failed:', error);
// //         // Fallback to mock data
// //         const mockScore = 0.7 + (Math.random() * 0.3 - 0.15);
// //         updateTrustUI(mockScore);
// //         return mockScore;
// //     }
// // }

// // // Update trust UI with NaN protection
// // function updateTrustUI(score) {
// //     const trustElement = document.getElementById('trustScore');
// //     const gaugeElement = document.getElementById('trustGauge');
    
// //     // NaN protection
// //     if (isNaN(score) || score === null || score === undefined) {
// //         console.warn('⚠️ Invalid score received, using default:', score);
// //         score = 0.7;
// //     }
    
// //     // Ensure score is between 0 and 1
// //     score = Math.max(0, Math.min(1, score));
    
// //     if (trustElement) {
// //         trustElement.textContent = score.toFixed(2);
        
// //         // Color coding based on score
// //         if (score > 0.7) {
// //             trustElement.style.color = '#24d27b'; // Green
// //         } else if (score > 0.4) {
// //             trustElement.style.color = '#d2b624'; // Yellow
// //         } else {
// //             trustElement.style.color = '#d22424'; // Red
// //         }
// //     }
    
// //     if (gaugeElement) {
// //         gaugeElement.style.width = `${score * 100}%`;
        
// //         // Color coding for gauge
// //         if (score > 0.7) {
// //             gaugeElement.style.background = '#24d27b';
// //         } else if (score > 0.4) {
// //             gaugeElement.style.background = '#d2b624';
// //         } else {
// //             gaugeElement.style.background = '#d22424';
// //         }
// //     }
// // }

// // // Update sensor data charts
// // function updateSensorData() {
// //     // Simulate sensor data updates
// //     return {
// //         wifiStability: Math.random() * 0.2 + 0.7,
// //         audioConsistency: Math.random() * 0.2 + 0.6,
// //         watchProximity: Math.random() * 0.3 + 0.6,
// //         featureDrift: Math.random() * 0.2
// //     };
// // }

// // // Update histogram
// // function updateHistogram(decision) {
// //     const histChartElement = document.getElementById('histChart');
// //     if (!histChartElement) return;
    
// //     // Simple histogram update without Chart.js for now
// //     console.log('📊 Decision recorded:', decision);
// // }

// // // Make authentication decision
// // async function makeDecision(trustScore) {
// //     if (!currentUser) return;
    
// //     try {
// //         // Try to save decision to backend
// //         const response = await fetch('/api/auth/decision', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify({
// //                 user_id: currentUser.user_id,
// //                 trust: trustScore
// //             })
// //         });
        
// //         let result, note;
        
// //         if (response.ok) {
// //             const data = await response.json();
// //             result = data.result;
// //             note = data.note;
// //             console.log('✅ Decision saved to backend:', result);
// //         } else {
// //             // Fallback decision making
// //             if (trustScore > 0.7) {
// //                 result = "ALLOW";
// //                 note = "Normal behavior pattern";
// //             } else if (trustScore > 0.4) {
// //                 result = "CHALLENGE";
// //                 note = "Additional verification required";
// //             } else {
// //                 result = "BLOCK";
// //                 note = "Suspicious activity detected";
// //             }
// //             console.log('⚠️ Using fallback decision:', result);
// //         }
        
// //         addDecisionToTable(trustScore, result, note);
// //         updateHistogram(result);
        
// //         return { result, note, trust: trustScore };
        
// //     } catch (error) {
// //         console.error('❌ Decision error:', error);
        
// //         // Final fallback
// //         const result = trustScore > 0.5 ? "ALLOW" : "CHALLENGE";
// //         const note = "Automatic decision";
        
// //         addDecisionToTable(trustScore, result, note);
// //         updateHistogram(result);
        
// //         return { result, note, trust: trustScore };
// //     }
// // }

// // // Add decision to table
// // function addDecisionToTable(trust, result, note) {
// //     const tbody = document.getElementById('decisionsBody');
// //     if (!tbody) {
// //         console.warn('❌ Decisions table not found');
// //         return;
// //     }
    
// //     // Remove "no decisions" message if present
// //     if (tbody.children.length === 1 && tbody.children[0].cells.length === 1) {
// //         tbody.innerHTML = '';
// //     }
    
// //     const row = document.createElement('tr');
    
// //     // Add class based on decision result
// //     let decisionClass = '';
// //     if (result === 'ALLOW') decisionClass = 'decision-allow';
// //     else if (result === 'CHALLENGE') decisionClass = 'decision-challenge';
// //     else if (result === 'BLOCK') decisionClass = 'decision-block';
    
// //     row.innerHTML = `
// //         <td>${new Date().toLocaleTimeString()}</td>
// //         <td>${trust.toFixed(2)}</td>
// //         <td class="${decisionClass}">${result}</td>
// //         <td>${note}</td>
// //     `;
    
// //     tbody.insertBefore(row, tbody.firstChild);
    
// //     // Keep only last 10 decisions
// //     while (tbody.children.length > 10) {
// //         tbody.removeChild(tbody.lastChild);
// //     }
// // }

// // // Start streaming trust data
// // async function startStream() {
// //     if (isStreaming) return;
    
// //     console.log("▶️ Starting stream...");
// //     isStreaming = true;
    
// //     // Update UI
// //     const statusElement = document.getElementById('status');
// //     if (statusElement) {
// //         statusElement.textContent = 'ACTIVE';
// //         statusElement.className = 'status safe';
// //     }
    
// //     const btnStart = document.getElementById('btnStart');
// //     const btnStop = document.getElementById('btnStop');
    
// //     if (btnStart) btnStart.classList.add('ghost');
// //     if (btnStop) btnStop.classList.remove('ghost');
    
// //     // Clear any existing interval
// //     if (updateInterval) {
// //         clearInterval(updateInterval);
// //     }
    
// //     let counter = 0;
    
// //     // Start data generation every 3 seconds (slower for demo)
// //     updateInterval = setInterval(async () => {
// //         if (!isStreaming) return;
        
// //         counter++;
// //         console.log(`🔄 Update #${counter}`);
        
// //         try {
// //             // Get trust score
// //             const trustScore = await updateTrustScore();
            
// //             // Update sensor data
// //             updateSensorData();
            
// //             // Make authentication decision every 15 seconds (every 5th update)
// //             if (counter % 5 === 0) {
// //                 await makeDecision(trustScore);
// //             }
            
// //         } catch (error) {
// //             console.error('❌ Stream update error:', error);
// //         }
        
// //     }, 3000); // Update every 3 seconds
// // }

// // // Stop streaming
// // function stopStream() {
// //     console.log("⏹️ Stopping stream...");
// //     isStreaming = false;
    
// //     // Update UI
// //     const statusElement = document.getElementById('status');
// //     if (statusElement) {
// //         statusElement.textContent = 'STOPPED';
// //         statusElement.className = 'status';
// //     }
    
// //     const btnStart = document.getElementById('btnStart');
// //     const btnStop = document.getElementById('btnStop');
    
// //     if (btnStart) btnStart.classList.remove('ghost');
// //     if (btnStop) btnStop.classList.add('ghost');
    
// //     // Clear the update interval
// //     if (updateInterval) {
// //         clearInterval(updateInterval);
// //         updateInterval = null;
// //     }
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

// // // Test API connectivity
// // async function testAPIConnectivity() {
// //     console.log('🔧 Testing API connectivity...');
    
// //     try {
// //         const response = await fetch('/api/health');
// //         const data = await response.json();
// //         console.log('✅ Health check:', data);
// //         return true;
// //     } catch (error) {
// //         console.error('❌ Health check failed:', error);
// //         return false;
// //     }
// // }

// // // Initialize when page loads
// // document.addEventListener('DOMContentLoaded', async function() {
// //     console.log("🚀 User dashboard loaded");
    
// //     // Test API first
// //     await testAPIConnectivity();
    
// //     // Check authentication
// //     if (!checkAuth()) {
// //         return; // Redirect will happen automatically
// //     }
    
// //     // Get user profile
// //     const authenticated = await getUserProfile();
// //     if (!authenticated) {
// //         return; // Redirect will happen automatically
// //     }
    
// //     console.log("✅ Starting dashboard for user:", currentUser.username);
    
// //     // Initialize charts
// //     initCharts();
    
// //     // Add event listeners
// //     const btnStart = document.getElementById('btnStart');
// //     const btnStop = document.getElementById('btnStop');
// //     const btnLogout = document.getElementById('btnLogout');
    
// //     if (btnStart) btnStart.addEventListener('click', startStream);
// //     if (btnStop) btnStop.addEventListener('click', stopStream);
// //     if (btnLogout) btnLogout.addEventListener('click', logout);
    
// //     // Set initial button states
// //     if (btnStop) btnStop.classList.add('ghost');
    
// //     // Load initial trust score
// //     await updateTrustScore();
    
// //     console.log("✅ Dashboard fully initialized");
    
// //     // Show welcome message
// //     setTimeout(() => {
// //         console.log("🎯 Dashboard ready! Click 'Start Stream' to begin monitoring.");
// //     }, 1000);
// // });

// const API_BASE = "http://127.0.0.1:5000/api";
// let isStreaming = false;
// let updateInterval;
// let trustChart = null;
// let currentUser = null;

// // Helper functions
// function getAuthToken() {
//     return localStorage.getItem('authToken');
// }

// function getCurrentUserId() {
//     return localStorage.getItem('userId') || '1';
// }

// function getCurrentUsername() {
//     return localStorage.getItem('username') || 'sample';
// }

// // Simple behavioral data collection
// function collectBehavioralData() {
//     return {
//         typing_metrics: { 
//             speed: Math.random() * 50 + 30, 
//             rhythm: Math.random() * 0.5 + 0.5 
//         },
//         mouse_metrics: { 
//             speed: Math.random() * 50 + 50, 
//             accuracy: Math.random() * 0.3 + 0.7 
//         },
//         context: { 
//             time_of_day: new Date().getHours(),
//             user_agent: navigator.userAgent 
//         }
//     };
// }

// // Check authentication
// function checkAuth() {
//     const token = getAuthToken();
//     const userId = getCurrentUserId();
    
//     console.log('🔐 Auth check - Token:', token ? 'Present' : 'Missing', 'User ID:', userId);
    
//     if (!token || !userId) {
//         console.log('❌ Not authenticated, redirecting to login');
//         window.location.href = '/login.html';
//         return false;
//     }
    
//     console.log('✅ Authentication check passed');
//     return true;
// }

// // Get user profile
// async function getUserProfile() {
//     const username = getCurrentUsername();
//     const userId = getCurrentUserId();
    
//     currentUser = {
//         user_id: parseInt(userId),
//         username: username,
//         device: 'Current Device'
//     };
    
//     console.log('✅ User profile loaded:', currentUser.username);
//     updateUserInterface();
//     return true;
// }

// // Update UI with user info
// function updateUserInterface() {
//     if (currentUser) {
//         const userElement = document.getElementById('user');
//         const deviceElement = document.getElementById('device');
//         const welcomeElement = document.getElementById('userWelcome');
        
//         if (userElement) userElement.textContent = currentUser.username;
//         if (deviceElement) deviceElement.textContent = currentUser.device;
//         if (welcomeElement) welcomeElement.textContent = `Welcome, ${currentUser.username}`;
        
//         console.log('✅ UI updated with user info');
//     }
// }

// // Initialize trust chart
// function initTrustChart() {
//     console.log("📊 Initializing trust chart...");
    
//     const trustCtx = document.getElementById('trustChart');
//     if (!trustCtx) {
//         console.error('❌ Trust chart canvas not found!');
//         return;
//     }
    
//     trustChart = new Chart(trustCtx, {
//         type: 'line',
//         data: {
//             labels: [],
//             datasets: [{
//                 label: 'Trust Score',
//                 data: [],
//                 borderColor: '#24d27b',
//                 backgroundColor: 'rgba(36, 210, 123, 0.1)',
//                 tension: 0.4,
//                 fill: true,
//                 pointRadius: 4,
//                 pointBackgroundColor: '#24d27b',
//                 borderWidth: 3
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     max: 1,
//                     min: 0,
//                     grid: { 
//                         color: 'rgba(255,255,255,0.1)',
//                         borderDash: [5, 5]
//                     },
//                     ticks: {
//                         color: '#fff',
//                         font: { size: 12 }
//                     }
//                 },
//                 x: { 
//                     display: true,
//                     grid: { 
//                         color: 'rgba(255,255,255,0.1)',
//                         borderDash: [5, 5]
//                     },
//                     ticks: {
//                         color: '#fff',
//                         font: { size: 12 }
//                     }
//                 }
//             },
//             plugins: { 
//                 legend: { 
//                     display: false 
//                 },
//                 tooltip: {
//                     backgroundColor: 'rgba(0,0,0,0.8)',
//                     titleColor: '#fff',
//                     bodyColor: '#fff'
//                 }
//             }
//         }
//     });
    
//     console.log("✅ Trust chart initialized successfully");
// }


// // Update trust score
// async function updateTrustScore() {
//     try {
//         // Simulate API call with random data for demo
//         const mockTrustScore = 0.7 + (Math.random() * 0.3 - 0.15); // 0.55-0.85
//         const trustScore = Math.max(0.1, Math.min(0.99, mockTrustScore));
        
//         console.log('📊 Generated trust score:', trustScore);
//         updateTrustUI(trustScore);
//         updateTrustChart(trustScore);
        
//         return trustScore;
        
//     } catch (error) {
//         console.error('❌ Trust score update failed:', error);
//         const fallbackScore = 0.7;
//         updateTrustUI(fallbackScore);
//         updateTrustChart(fallbackScore);
//         return fallbackScore;
//     }
// }

// // Update trust UI
// function updateTrustUI(score) {
//     // NaN protection
//     if (isNaN(score) || score === null || score === undefined) {
//         console.warn('⚠️ Invalid score, using default');
//         score = 0.7;
//     }
    
//     score = Math.max(0, Math.min(1, score));
    
//     // Update numeric display
//     const trustElement = document.getElementById('trustScore');
//     if (trustElement) {
//         trustElement.textContent = score.toFixed(2);
//         trustElement.style.color = score > 0.7 ? '#24d27b' : score > 0.4 ? '#d2b624' : '#d22424';
//     }
    
//     // Update gauge
//     const gaugeElement = document.getElementById('trustGauge');
//     if (gaugeElement) {
//         gaugeElement.style.width = `${score * 100}%`;
//         gaugeElement.style.background = score > 0.7 ? '#24d27b' : score > 0.4 ? '#d2b624' : '#d22424';
//     }
    
//     // Update status
//     const statusElement = document.getElementById('status');
//     if (statusElement) {
//         if (score > 0.7) {
//             statusElement.textContent = 'SAFE';
//             statusElement.className = 'status safe';
//         } else if (score > 0.4) {
//             statusElement.textContent = 'WARNING';
//             statusElement.className = 'status warning';
//         } else {
//             statusElement.textContent = 'RISK';
//             statusElement.className = 'status risk';
//         }
//     }
// }

// // Update trust chart
// function updateTrustChart(score) {
//     if (!trustChart) return;
    
//     const now = new Date();
//     const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
    
//     // Add new data point
//     trustChart.data.labels.push(timeLabel);
//     trustChart.data.datasets[0].data.push(score);
    
//     // Keep only last 10 points
//     if (trustChart.data.labels.length > 10) {
//         trustChart.data.labels.shift();
//         trustChart.data.datasets[0].data.shift();
//     }
    
//     // Update chart
//     trustChart.update('active');
    
//     console.log('📈 Chart updated with score:', score);
// }

// // Make authentication decision
// async function makeDecision(trustScore) {
//     if (!currentUser) return;
    
//     let result, note;
    
//     if (trustScore > 0.7) {
//         result = "ALLOW";
//         note = "Normal behavior pattern detected";
//     } else if (trustScore > 0.4) {
//         result = "CHALLENGE";
//         note = "Additional verification required";
//     } else {
//         result = "BLOCK";
//         note = "Suspicious activity detected";
//     }
    
//     addDecisionToTable(trustScore, result, note);
//     console.log(`✅ Decision: ${result} (Trust: ${trustScore.toFixed(2)})`);
    
//     return { result, note, trust: trustScore };
// }

// // Add decision to table
// function addDecisionToTable(trust, result, note) {
//     const tbody = document.getElementById('decisionsBody');
//     if (!tbody) {
//         console.warn('❌ Decisions table not found');
//         return;
//     }
    
//     // Remove "no decisions" message if present
//     if (tbody.children.length === 1 && tbody.children[0].cells.length === 1) {
//         tbody.innerHTML = '';
//     }
    
//     const row = document.createElement('tr');
    
//     // Add class based on decision result
//     let decisionClass = '';
//     if (result === 'ALLOW') decisionClass = 'decision-allow';
//     else if (result === 'CHALLENGE') decisionClass = 'decision-challenge';
//     else if (result === 'BLOCK') decisionClass = 'decision-block';
    
//     row.innerHTML = `
//         <td>${new Date().toLocaleTimeString()}</td>
//         <td>${trust.toFixed(2)}</td>
//         <td class="${decisionClass}">${result}</td>
//         <td>${note}</td>
//     `;
    
//     tbody.insertBefore(row, tbody.firstChild);
    
//     // Keep only last 8 decisions
//     while (tbody.children.length > 8) {
//         tbody.removeChild(tbody.lastChild);
//     }
// }

// // Start streaming trust data
// async function startStream() {
//     if (isStreaming) {
//         console.log('⚠️ Stream already running');
//         return;
//     }
    
//     console.log("▶️ Starting trust stream...");
//     isStreaming = true;
    
//     // Update UI
//     const btnStart = document.getElementById('btnStart');
//     const btnStop = document.getElementById('btnStop');
    
//     if (btnStart) btnStart.disabled = true;
//     if (btnStop) btnStop.disabled = false;
    
//     let counter = 0;
    
//     // Clear any existing interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//     }
    
//     // Start data generation every 2 seconds
//     updateInterval = setInterval(async () => {
//         if (!isStreaming) return;
        
//         counter++;
//         console.log(`🔄 Stream update #${counter}`);
        
//         try {
//             // Get and update trust score
//             const trustScore = await updateTrustScore();
            
//             // Make authentication decision every 3 updates
//             if (counter % 3 === 0) {
//                 await makeDecision(trustScore);
//             }
            
//         } catch (error) {
//             console.error('❌ Stream update error:', error);
//         }
        
//     }, 2000); // Update every 2 seconds
    
//     console.log("✅ Stream started successfully");
// }

// // Stop streaming
// function stopStream() {
//     if (!isStreaming) return;
    
//     console.log("⏹️ Stopping trust stream...");
//     isStreaming = false;
    
//     // Update UI
//     const btnStart = document.getElementById('btnStart');
//     const btnStop = document.getElementById('btnStop');
    
//     if (btnStart) btnStart.disabled = false;
//     if (btnStop) btnStop.disabled = true;
    
//     // Clear the update interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//         updateInterval = null;
//     }
    
//     console.log("✅ Stream stopped");
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

// // Initialize when page loads
// document.addEventListener('DOMContentLoaded', async function() {
//     console.log("🚀 Continuous 2FA Dashboard Loading...");
    
//     // Check authentication
//     if (!checkAuth()) {
//         return;
//     }
    
//     // Get user profile
//     await getUserProfile();
    
//     console.log("✅ Initializing dashboard components...");
    
//     // Initialize trust chart
//     initTrustChart();
    
//     // Add event listeners
//     const btnStart = document.getElementById('btnStart');
//     const btnStop = document.getElementById('btnStop');
//     const btnLogout = document.getElementById('btnLogout');
    
//     if (btnStart) {
//         btnStart.addEventListener('click', startStream);
//         console.log('✅ Start button listener added');
//     }
    
//     if (btnStop) {
//         btnStop.addEventListener('click', stopStream);
//         btnStop.disabled = true; // Initially disabled
//         console.log('✅ Stop button listener added');
//     }
    
//     if (btnLogout) {
//         btnLogout.addEventListener('click', logout);
//         console.log('✅ Logout button listener added');
//     }
    
//     // Load initial trust score
//     await updateTrustScore();
    
//     console.log("🎯 Dashboard fully initialized - Click 'Start Stream' to begin!");
    
//     // Auto-start stream after 2 seconds (optional)
//     setTimeout(() => {
//         console.log("🔄 Auto-starting stream in 2 seconds...");
//         startStream();
//     }, 2000);
// });

const API_BASE = "http://127.0.0.1:5000/api";
let isStreaming = false;
let updateInterval;
let trustChart = null;
let currentUser = null;

// Helper functions
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function getCurrentUserId() {
    return localStorage.getItem('userId') || '1';
}

function getCurrentUsername() {
    return localStorage.getItem('username') || 'sample';
}

// Check authentication
function checkAuth() {
    const token = getAuthToken();
    const userId = getCurrentUserId();
    
    console.log('🔐 Auth check - Token:', token ? 'Present' : 'Missing', 'User ID:', userId);
    
    if (!token || !userId) {
        console.log('❌ Not authenticated, redirecting to login');
        window.location.href = '/login.html';
        return false;
    }
    
    console.log('✅ Authentication check passed');
    return true;
}

// Get user profile
async function getUserProfile() {
    const username = getCurrentUsername();
    const userId = getCurrentUserId();
    
    currentUser = {
        user_id: parseInt(userId),
        username: username,
        device: 'Current Device'
    };
    
    console.log('✅ User profile loaded:', currentUser.username);
    updateUserInterface();
    return true;
}

// Update UI with user info
function updateUserInterface() {
    if (currentUser) {
        const welcomeElement = document.getElementById('userWelcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${currentUser.username}`;
        }
        console.log('✅ UI updated with user info');
    }
}

// Initialize trust chart
function initTrustChart() {
    console.log("📊 Initializing trust chart...");
    
    const trustCtx = document.getElementById('trustChart');
    if (!trustCtx) {
        console.error('❌ Trust chart canvas not found!');
        return;
    }
    
    trustChart = new Chart(trustCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Trust Score',
                data: [],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#27ae60',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    min: 0,
                    grid: { 
                        color: 'rgba(0,0,0,0.1)',
                    },
                    ticks: {
                        color: '#333',
                        font: { size: 12 }
                    }
                },
                x: { 
                    display: true,
                    grid: { 
                        color: 'rgba(0,0,0,0.1)',
                    },
                    ticks: {
                        color: '#333',
                        font: { size: 12 }
                    }
                }
            },
            plugins: { 
                legend: { 
                    display: false 
                }
            }
        }
    });
    
    console.log("✅ Trust chart initialized successfully");
}

// Update trust score
async function updateTrustScore() {
    try {
        const behavioralData = {
            typing_metrics: { 
                speed: Math.random() * 50 + 30,
                rhythm: Math.random() * 0.5 + 0.5
            },
            mouse_metrics: {
                speed: Math.random() * 50 + 50,
                accuracy: Math.random() * 0.3 + 0.7
            },
            context: {
                time_of_day: new Date().getHours(),
                user_agent: navigator.userAgent
            }
        };
        
        const response = await fetch('/api/trust/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: getCurrentUserId(),
                behavioral_data: behavioralData
            })
        });
        
        let trustScore;
        if (response.ok) {
            const data = await response.json();
            trustScore = data.trust_score;
            console.log('✅ Trust score from API:', trustScore);
        } else {
            // Fallback to mock data
            trustScore = 0.7 + (Math.random() * 0.3 - 0.15);
            console.log('⚠️ Using mock trust score:', trustScore);
        }
        
        trustScore = Math.max(0.1, Math.min(0.99, trustScore));
        updateTrustUI(trustScore);
        updateTrustChart(trustScore);
        
        return trustScore;
        
    } catch (error) {
        console.error('❌ Trust score update failed:', error);
        const fallbackScore = 0.7;
        updateTrustUI(fallbackScore);
        updateTrustChart(fallbackScore);
        return fallbackScore;
    }
}

// Update trust UI
function updateTrustUI(score) {
    if (isNaN(score) || score === null || score === undefined) {
        console.warn('⚠️ Invalid score, using default');
        score = 0.7;
    }
    
    score = Math.max(0, Math.min(1, score));
    
    // Update numeric display
    const trustElement = document.getElementById('trustScore');
    if (trustElement) {
        trustElement.textContent = score.toFixed(2);
        trustElement.style.color = score > 0.7 ? '#27ae60' : score > 0.4 ? '#f39c12' : '#e74c3c';
    }
    
    // Update gauge
    const gaugeElement = document.getElementById('trustGauge');
    if (gaugeElement) {
        gaugeElement.style.width = `${score * 100}%`;
        gaugeElement.style.background = score > 0.7 ? '#27ae60' : score > 0.4 ? '#f39c12' : '#e74c3c';
    }
    
    // Update status
    const statusElement = document.getElementById('status');
    if (statusElement) {
        if (score > 0.7) {
            statusElement.textContent = 'SAFE';
            statusElement.className = 'status safe';
        } else if (score > 0.4) {
            statusElement.textContent = 'WARNING';
            statusElement.className = 'status warning';
        } else {
            statusElement.textContent = 'RISK';
            statusElement.className = 'status risk';
        }
    }
}

// Update trust chart
function updateTrustChart(score) {
    if (!trustChart) return;
    
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    trustChart.data.labels.push(timeLabel);
    trustChart.data.datasets[0].data.push(score);
    
    if (trustChart.data.labels.length > 15) {
        trustChart.data.labels.shift();
        trustChart.data.datasets[0].data.shift();
    }
    
    trustChart.update('active');
}

// Make authentication decision
async function makeDecision(trustScore) {
    if (!currentUser) return;
    
    try {
        const response = await fetch('/api/auth/decision', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUser.user_id,
                trust: trustScore
            })
        });
        
        let result, note;
        if (response.ok) {
            const data = await response.json();
            result = data.result;
            note = data.note;
        } else {
            // Fallback decision making
            if (trustScore > 0.7) {
                result = "ALLOW";
                note = "Normal behavior pattern detected";
            } else if (trustScore > 0.4) {
                result = "CHALLENGE";
                note = "Additional verification required";
            } else {
                result = "BLOCK";
                note = "Suspicious activity detected";
            }
        }
        
        addDecisionToTable(trustScore, result, note);
        return { result, note, trust: trustScore };
        
    } catch (error) {
        console.error('❌ Decision error:', error);
        const result = trustScore > 0.5 ? "ALLOW" : "CHALLENGE";
        const note = "Automatic decision";
        addDecisionToTable(trustScore, result, note);
        return { result, note, trust: trustScore };
    }
}

// Add decision to table
function addDecisionToTable(trust, result, note) {
    const tbody = document.getElementById('decisionsBody');
    if (!tbody) return;
    
    // Remove "no decisions" message
    if (tbody.children.length === 1 && tbody.children[0].cells.length === 1) {
        tbody.innerHTML = '';
    }
    
    const row = document.createElement('tr');
    row.className = 'fade-in';
    
    let decisionClass = '';
    if (result === 'ALLOW') decisionClass = 'decision-allow';
    else if (result === 'CHALLENGE') decisionClass = 'decision-challenge';
    else if (result === 'BLOCK') decisionClass = 'decision-block';
    
    row.innerHTML = `
        <td>${new Date().toLocaleTimeString()}</td>
        <td style="font-weight: bold;">${trust.toFixed(2)}</td>
        <td class="${decisionClass}">${result}</td>
        <td>${note}</td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    
    while (tbody.children.length > 10) {
        tbody.removeChild(tbody.lastChild);
    }
}

// Start streaming trust data
async function startStream() {
    if (isStreaming) return;
    
    console.log("▶️ Starting trust stream...");
    isStreaming = true;
    
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    
    if (btnStart) btnStart.disabled = true;
    if (btnStop) btnStop.disabled = false;
    
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    let counter = 0;
    updateInterval = setInterval(async () => {
        if (!isStreaming) return;
        
        counter++;
        console.log(`🔄 Stream update #${counter}`);
        
        try {
            const trustScore = await updateTrustScore();
            
            if (counter % 3 === 0) {
                await makeDecision(trustScore);
            }
            
        } catch (error) {
            console.error('❌ Stream update error:', error);
        }
        
    }, 2000);
    
    console.log("✅ Stream started successfully");
}

// Stop streaming
function stopStream() {
    if (!isStreaming) return;
    
    console.log("⏹️ Stopping trust stream...");
    isStreaming = false;
    
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    
    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.disabled = true;
    
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    
    console.log("✅ Stream stopped");
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🚀 Continuous 2FA Dashboard Loading...");
    
    if (!checkAuth()) {
        return;
    }
    
    await getUserProfile();
    initTrustChart();
    
    // Add event listeners
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    const btnLogout = document.getElementById('btnLogout');
    
    if (btnStart) btnStart.addEventListener('click', startStream);
    if (btnStop) btnStop.addEventListener('click', stopStream);
    if (btnLogout) btnLogout.addEventListener('click', logout);
    
    if (btnStop) btnStop.disabled = true;
    
    // Load initial trust score
    await updateTrustScore();
    
    console.log("🎯 Dashboard fully initialized - Click 'Start Monitoring' to begin!");
});
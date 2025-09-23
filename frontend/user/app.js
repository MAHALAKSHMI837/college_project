
// // // ---------------- Config ----------------
// // const CFG = {
// //   wifiIntervalSec: 60,
// //   audioIntervalSec: 300,
// //   watchIntervalSec: 30,
// //   trustMin: 0.65,
// //   watchProxMaxMeters: 3.0
// // };

// // // --------- Utility ---------
// // const $ = (sel)=>document.querySelector(sel);
// // function fmtTime(t){ return new Date(t).toLocaleTimeString(); }
// // function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

// // // Simple sparkline-like chart renderer
// // function renderLineChart(canvas, data, opts = {}){
// //   const ctx = canvas.getContext('2d');
// //   const w = canvas.width = canvas.clientWidth;
// //   const h = canvas.height = canvas.clientHeight;
// //   ctx.clearRect(0,0,w,h);
// //   const pad = 20;
// //   const X = (i)=> pad + (w-2*pad) * (i/(data.length-1||1));
// //   const min = Math.min(...data), max = Math.max(...data);
// //   const Y = (v)=> h-pad - (h-2*pad) * ((v-min)/((max-min)||1));
// //   ctx.lineWidth = 2;
// //   ctx.beginPath();
// //   data.forEach((v,i)=>{
// //     const x = X(i), y = Y(v);
// //     if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
// //   });
// //   ctx.strokeStyle = "#5b8cff";
// //   ctx.stroke();
// //   // points
// //   ctx.fillStyle = "#9ab7ff";
// //   data.forEach((v,i)=> ctx.fillRect(X(i)-2, Y(v)-2, 4, 4));
// // }

// // function renderBars(canvas, buckets){
// //   const ctx = canvas.getContext('2d');
// //   const w = canvas.width = canvas.clientWidth;
// //   const h = canvas.height = canvas.clientHeight;
// //   ctx.clearRect(0,0,w,h);
// //   const pad = 24;
// //   const bw = (w-2*pad)/buckets.length;
// //   const max = Math.max(...buckets.map(b=>b.v),1);
// //   buckets.forEach((b,i)=>{
// //     const x = pad + i*bw + 6;
// //     const bh = (h-2*pad) * (b.v/max);
// //     ctx.fillStyle = "#5b8cff";
// //     ctx.fillRect(x, h-pad-bh, bw-12, bh);
// //     ctx.fillStyle = "#c7d6f5";
// //     ctx.fillText(b.k, x, h-8);
// //   });
// // }

// // // -------------- Data Fetch (mock) --------------
// // // BACKEND INTEGRATION: replace these with real endpoints.
// // async function pullLatestMetrics(){
// //   const wf = await fetch('sample_data/wifi_scans.json').then(r=>r.json());
// //   const au = await fetch('sample_data/audio_stats.json').then(r=>r.json());
// //   const dc = await fetch('sample_data/decisions.json').then(r=>r.json());
// //   return {wf, au, dc};
// // }

// // async function pullRecentDecisions(){ return (await fetch('sample_data/decisions.json').then(r=>r.json())).items; }
// // async function pullStreamConfig(){ return CFG; }

// // // -------------- Simulators --------------
// // let simTimer=null;
// // let trustSeries=[], wifiSeries=[], audioSeries=[], watchSeries=[], driftSeries=[], hist={safe:0, anomalous:0};

// // function simulateTick(){
// //   // Wi‑Fi fingerprint stability ~ RSSI average (higher magnitude negative)
// //   const rssi = -50 - Math.random()*25;
// //   wifiSeries.push(rssi); if(wifiSeries.length>40) wifiSeries.shift();

// //   // Audio MFCC entropy [0.4..0.9]
// //   const entropy = 0.5 + Math.random()*0.5 + (Math.random()<0.1?0.15:0);
// //   audioSeries.push(entropy); if(audioSeries.length>40) audioSeries.shift();

// //   // Watch proximity in meters
// //   const prox = Math.max(0, (Math.random()*4) + (Math.random()<0.2?2:0));
// //   watchSeries.push(prox); if(watchSeries.length>40) watchSeries.shift();

// //   // Simple drift: normalized variance of the three inputs
// //   const drift = (Math.abs(rssi+60)/25 + Math.abs(entropy-0.6)/0.4 + Math.abs(prox-1.5)/3.5)/3;
// //   driftSeries.push(drift); if(driftSeries.length>40) driftSeries.shift();

// //   // Trust: inverse of drift with floor
// //   let trust = clamp(1 - drift, 0, 1);
// //   if(prox > CFG.watchProxMaxMeters) trust -= 0.3;
// //   trust = clamp(trust, 0, 1);
// //   trustSeries.push(trust); if(trustSeries.length>60) trustSeries.shift();

// //   const result = trust >= CFG.trustMin ? "safe" : "anomalous";
// //   hist[result]++;

// //   // Render
// //   renderLineChart($('#trustChart'), trustSeries);
// //   renderLineChart($('#wifiChart'), wifiSeries);
// //   renderLineChart($('#audioChart'), audioSeries);
// //   renderLineChart($('#watchChart'), watchSeries);
// //   renderLineChart($('#driftChart'), driftSeries);
// //   renderBars($('#histChart'), [{k:'safe', v:hist.safe},{k:'anom', v:hist.anomalous}]);

// //   $('#trustScore').textContent = trust.toFixed(2);
// //   $('#status').textContent = result;
// //   $('#status').className = 'status ' + result;

// //   // table row
// //   const row = document.createElement('tr');
// //   const now = new Date().toLocaleTimeString();
// //   row.innerHTML = `<td>${now}</td><td>${trust.toFixed(2)}</td><td>${result}</td><td>${prox>CFG.watchProxMaxMeters?'Watch far':'OK'}</td>`;
// //   const tbody = $('#decisionsBody');
// //   tbody.prepend(row);
// //   while(tbody.children.length>12) tbody.removeChild(tbody.lastChild);
// // }

// // function startSim(){
// //   if(simTimer) return;
// //   $('#status').textContent = 'running';
// //   simTimer = setInterval(simulateTick, 1200);
// // }
// // function stopSim(){
// //   if(simTimer){ clearInterval(simTimer); simTimer=null; }
// //   $('#status').textContent = 'stopped';
// // }

// // // -------------- Init --------------
// // (async function init(){
// //   const cfg = await pullStreamConfig();
// //   $('#cfgWifiInt').textContent = cfg.wifiIntervalSec+'s';
// //   $('#cfgAudioInt').textContent = cfg.audioIntervalSec+'s';
// //   $('#cfgWatchInt').textContent = cfg.watchIntervalSec+'s';
// //   $('#cfgTrust').textContent = cfg.trustMin.toFixed(2);
// //   $('#cfgProx').textContent = cfg.watchProxMaxMeters.toFixed(1);

// //   // load seed tables
// //   const items = await pullRecentDecisions();
// //   const tbody = $('#decisionsBody');
// //   items.forEach(x=>{
// //     const tr = document.createElement('tr');
// //     tr.innerHTML = `<td>${fmtTime(x.timestamp)}</td><td>${x.trust.toFixed(2)}</td><td>${x.result}</td><td>${x.note||''}</td>`;
// //     tbody.appendChild(tr);
// //   });

// //   $('#btnStart').addEventListener('click', startSim);
// //   $('#btnStop').addEventListener('click', stopSim);
// // })();

// // const API_BASE = "http://192.168.1.3:5000/api";

// // // Load user metrics
// // async function loadMetrics() {
// //   try {
// //     const res = await fetch(`${API_BASE}/user/metrics/1`); // Example: user_id = 1
// //     if (!res.ok) throw new Error("Failed to fetch metrics");
// //     const data = await res.json();

// //     document.getElementById("wifi").innerText = `Wi-Fi RSSI: ${data.wifi_rssi}`;
// //     document.getElementById("audio").innerText = `Audio Entropy: ${data.audio_entropy}`;
// //     document.getElementById("watch").innerText = `Watch Proximity: ${data.watch_proximity}`;
// //   } catch (err) {
// //     console.error("Error fetching metrics:", err);
// //   }
// // }

// // // Load user decisions
// // async function loadDecisions() {
// //   try {
// //     const res = await fetch(`${API_BASE}/user/decisions/1`); // Example: user_id = 1
// //     if (!res.ok) throw new Error("Failed to fetch decisions");
// //     const data = await res.json();

// //     document.getElementById("decision").innerText =
// //       `Access: ${data.decision} (Trust Score: ${data.trust_score})`;
// //   } catch (err) {
// //     console.error("Error fetching decisions:", err);
// //   }
// // }

// // // Refresh dashboard every 5s
// // setInterval(() => {
// //   loadMetrics();
// //   loadDecisions();
// // }, 5000);

// // // Run once on load
// // loadMetrics();
// // loadDecisions();
// // ---------------- Config ----------------
// // const API_BASE = "http://127.0.0.1:5000/api";
// // const CFG = {
// //   wifiIntervalSec: 60,
// //   audioIntervalSec: 300,
// //   watchIntervalSec: 30,
// //   trustMin: 0.65,
// //   watchProxMaxMeters: 3.0
// // };

// // // --------- Utility ---------
// // const $ = (sel)=>document.querySelector(sel);
// // function fmtTime(t){ return new Date(t).toLocaleTimeString(); }
// // function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

// // // Chart renderers (same as before)
// // function renderLineChart(canvas, data, opts = {}) { const ctx = canvas.getContext('2d');
// //   const w = canvas.width = canvas.clientWidth;
// //   const h = canvas.height = canvas.clientHeight;
// //   ctx.clearRect(0,0,w,h);
// //   const pad = 20;
// //   const X = (i)=> pad + (w-2*pad) * (i/(data.length-1||1));
// //   const min = Math.min(...data), max = Math.max(...data);
// //   const Y = (v)=> h-pad - (h-2*pad) * ((v-min)/((max-min)||1));
// //   ctx.lineWidth = 2;
// //   ctx.beginPath();
// //   data.forEach((v,i)=>{
// //     const x = X(i), y = Y(v);
// //     if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
// //   });
// //   ctx.strokeStyle = "#5b8cff";
// //   ctx.stroke();
// //   // points
// //   ctx.fillStyle = "#9ab7ff";
// //   data.forEach((v,i)=> ctx.fillRect(X(i)-2, Y(v)-2, 4, 4));
// // }
// // function renderBars(canvas, buckets) { 
// //   const ctx = canvas.getContext('2d');
// //   const w = canvas.width = canvas.clientWidth;
// //   const h = canvas.height = canvas.clientHeight;
// //   ctx.clearRect(0,0,w,h);
// //   const pad = 24;
// //   const bw = (w-2*pad)/buckets.length;
// //   const max = Math.max(...buckets.map(b=>b.v),1);
// //   buckets.forEach((b,i)=>{
// //     const x = pad + i*bw + 6;
// //     const bh = (h-2*pad) * (b.v/max);
// //     ctx.fillStyle = "#5b8cff";
// //     ctx.fillRect(x, h-pad-bh, bw-12, bh);
// //     ctx.fillStyle = "#c7d6f5";
// //     ctx.fillText(b.k, x, h-8);
// //   });
// // }

// // // -------------- Backend Data Fetch --------------
// // async function pullLatestMetrics() {
// //   try {
// //     const res = await fetch(`${API_BASE}/user/metrics/1`);
// //     if (!res.ok) throw new Error("Failed to fetch metrics");
// //     return await res.json();
// //   } catch (e) {
// //     console.error("Metrics fetch failed:", e);
// //     return null;
// //   }
// // }

// // // Fetch decisions for a given user from backend
// // async function pullRecentDecisions(userId = 2) {   // default user_id=2 (Maha)
// //   try {
// //     const res = await fetch(`/api/user/decisions/${userId}`);
// //     const data = await res.json();

// //     // If backend returns {items: [...]}, normalize
// //     if (data.items) return data.items;

// //     // Otherwise backend returned raw rows
// //     return data.map(d => ({
// //       timestamp: d.created_at || d.timestamp,
// //       trust: d.trust_score || d.trust,
// //       result: d.result,
// //       note: d.note
// //     }));
// //   } catch (err) {
// //     console.error("Error fetching decisions:", err);
// //     return [];
// //   }
// // }

// // async function pullUserDecision() {
// //   try {
// //     const res = await fetch(`${API_BASE}/user/decisions/1`);
// //     if (!res.ok) throw new Error("Failed to fetch decision");
// //     return await res.json();
// //   } catch (e) {
// //     console.error("Decision fetch failed:", e);
// //     return null;
// //   }
// // }

// // // -------------- Stream Loop --------------
// // let streamTimer = null;
// // let trustSeries=[], wifiSeries=[], audioSeries=[], watchSeries=[], driftSeries=[], hist={safe:0, anomalous:0};

// // async function streamTick() {
// //   const metrics = await pullLatestMetrics();
// //   const decision = await pullUserDecision();
// //   if (!metrics || !decision) return;

// //   const rssi = metrics.wifi_rssi;
// //   const entropy = metrics.audio_entropy;
// //   const prox = metrics.watch_proximity;
// //   const trust = decision.trust_score;
// //   const result = decision.decision.toLowerCase();

// //   // push series data
// //   wifiSeries.push(rssi); if(wifiSeries.length>40) wifiSeries.shift();
// //   audioSeries.push(entropy); if(audioSeries.length>40) audioSeries.shift();
// //   watchSeries.push(prox); if(watchSeries.length>40) watchSeries.shift();
// //   trustSeries.push(trust); if(trustSeries.length>60) trustSeries.shift();

// //   hist[result]++;

// //   // render charts
// //   renderLineChart($('#trustChart'), trustSeries);
// //   renderLineChart($('#wifiChart'), wifiSeries);
// //   renderLineChart($('#audioChart'), audioSeries);
// //   renderLineChart($('#watchChart'), watchSeries);
// //   renderBars($('#histChart'), [{k:'safe', v:hist.safe},{k:'anom', v:hist.anomalous}]);

// //   $('#trustScore').textContent = trust.toFixed(2);
// //   $('#status').textContent = result;
// //   $('#status').className = 'status ' + result;

// //   // add table row
// //   const row = document.createElement('tr');
// //   row.innerHTML = `<td>${fmtTime(Date.now())}</td><td>${trust.toFixed(2)}</td><td>${result}</td><td>${prox>CFG.watchProxMaxMeters?'Watch far':'OK'}</td>`;
// //   const tbody = $('#decisionsBody');
// //   tbody.prepend(row);
// //   while(tbody.children.length>12) tbody.removeChild(tbody.lastChild);
// // }

// // function startStream() {
// //   if (streamTimer) return;
// //   $('#status').textContent = 'running';
// //   streamTimer = setInterval(streamTick, 3000); // every 3s
// // }
// // function stopStream() {
// //   if (streamTimer) {
// //     clearInterval(streamTimer);
// //     streamTimer = null;
// //   }
// //   $('#status').textContent = 'stopped';
// // }

// // // -------------- Init --------------
// // (async function init(){
// //   // Load config
// //   const cfg = await pullStreamConfig();
// //   $('#cfgWifiInt').textContent = cfg.wifiIntervalSec+'s';
// //   $('#cfgAudioInt').textContent = cfg.audioIntervalSec+'s';
// //   $('#cfgWatchInt').textContent = cfg.watchIntervalSec+'s';
// //   $('#cfgTrust').textContent = cfg.trustMin.toFixed(2);
// //   $('#cfgProx').textContent = cfg.watchProxMaxMeters.toFixed(1);

// //   // Load decisions once (NOT in real-time)
// //   const items = await pullRecentDecisions(2); // user_id=2 (Maha)
// //   const tbody = $('#decisionsBody');

// //   items.forEach(x => {
// //     const tr = document.createElement('tr');
// //     tr.innerHTML = `
// //       <td>${fmtTime(x.timestamp)}</td>
// //       <td>${x.trust.toFixed(2)}</td>
// //       <td>${x.result}</td>
// //       <td>${x.note || ''}</td>
// //     `;
// //     tbody.appendChild(tr);
// //   });

// //   // Buttons to start/stop simulator (if needed)
// //   $('#btnStart').addEventListener('click', startStream);
// //   $('#btnStop').addEventListener('click', stopStream);
// // })();

// const API_BASE = "http://127.0.0.1:5000/api";
// let trustData = [];
// let isStreaming = false;
// let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;
// let updateInterval;

// // Initialize all charts
// function initCharts() {
//     // Trust Score Chart
//     trustChart = new Chart(document.getElementById('trustChart'), {
//         type: 'line',
//         data: {
//             labels: [],
//             datasets: [{
//                 label: 'Trust Score',
//                 data: [],
//                 borderColor: '#24d27b',
//                 tension: 0.4,
//                 fill: false,
//                 pointRadius: 3
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     max: 1,
//                     grid: { display: false }
//                 },
//                 x: { display: false }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });

//     // WiFi RSSI Chart
//     wifiChart = new Chart(document.getElementById('wifiChart'), {
//         type: 'bar',
//         data: {
//             labels: ['AP-1', 'AP-2', 'AP-3', 'AP-4', 'AP-5'],
//             datasets: [{
//                 label: 'RSSI (dBm)',
//                 data: [-45, -52, -60, -65, -70],
//                 backgroundColor: '#4f79bc',
//                 borderWidth: 0
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: { 
//                     reverse: true,
//                     min: -90,
//                     max: -30,
//                     grid: { display: false }
//                 }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });

//     // Audio MFCC Chart
//     audioChart = new Chart(document.getElementById('audioChart'), {
//         type: 'line',
//         data: {
//             labels: Array.from({length: 13}, (_, i) => `MFCC ${i+1}`),
//             datasets: [{
//                 label: 'Entropy',
//                 data: Array(13).fill(0).map(() => Math.random() * 2 + 1),
//                 borderColor: '#bc4f7d',
//                 tension: 0.4,
//                 fill: false
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: { grid: { display: false } },
//                 x: { grid: { display: false } }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });

//     // Watch Proximity Chart
//     watchChart = new Chart(document.getElementById('watchChart'), {
//         type: 'line',
//         data: {
//             labels: [],
//             datasets: [{
//                 label: 'Distance (m)',
//                 data: [],
//                 borderColor: '#4fbca9',
//                 tension: 0.4,
//                 fill: false,
//                 pointRadius: 2
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     min: 0,
//                     max: 10,
//                     grid: { display: false }
//                 },
//                 x: { display: false }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });

//     // Feature Drift Chart
//     driftChart = new Chart(document.getElementById('driftChart'), {
//         type: 'line',
//         data: {
//             labels: [],
//             datasets: [{
//                 label: 'Drift Score',
//                 data: [],
//                 borderColor: '#d27b24',
//                 tension: 0.4,
//                 fill: false,
//                 pointRadius: 2
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     min: 0,
//                     max: 1,
//                     grid: { display: false }
//                 },
//                 x: { display: false }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });

//     // Decision Histogram
//     histChart = new Chart(document.getElementById('histChart'), {
//         type: 'bar',
//         data: {
//             labels: ['ALLOW', 'CHALLENGE', 'BLOCK'],
//             datasets: [{
//                 label: 'Count',
//                 data: [0, 0, 0],
//                 backgroundColor: ['#24d27b', '#d2b624', '#d22424'],
//                 borderWidth: 0
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: { beginAtZero: true, grid: { display: false } },
//                 x: { grid: { display: false } }
//             },
//             plugins: { legend: { display: false } }
//         }
//     });
// }

// // Simulate data collection
// function collectWiFiData() {
//     // Simulate WiFi RSSI changes
//     const newData = wifiChart.data.datasets[0].data.map(value => {
//         const change = (Math.random() - 0.5) * 5;
//         return Math.max(-90, Math.min(-30, value + change));
//     });
//     wifiChart.data.datasets[0].data = newData;
//     wifiChart.update();
    
//     // Calculate WiFi stability score (0-1)
//     const mean = newData.reduce((a, b) => a + b, 0) / newData.length;
//     const variance = newData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / newData.length;
//     const stability = Math.max(0, 1 - (variance / 100));
    
//     return stability;
// }

// function collectAudioData() {
//     // Simulate audio MFCC entropy changes
//     const newData = audioChart.data.datasets[0].data.map(value => {
//         const change = (Math.random() - 0.5) * 0.3;
//         return Math.max(0.5, Math.min(3.5, value + change));
//     });
//     audioChart.data.datasets[0].data = newData;
//     audioChart.update();
    
//     // Calculate audio consistency score (0-1)
//     const mean = newData.reduce((a, b) => a + b, 0) / newData.length;
//     const consistency = Math.max(0, 1 - (Math.abs(mean - 2) / 1.5));
    
//     return consistency;
// }

// function collectWatchData() {
//     // Simulate watch proximity
//     const timestamp = new Date().toLocaleTimeString();
//     const distance = Math.random() * 8 + 1; // 1-9 meters
    
//     // Update watch chart
//     if (watchChart.data.labels.length > 10) {
//         watchChart.data.labels.shift();
//         watchChart.data.datasets[0].data.shift();
//     }
//     watchChart.data.labels.push(timestamp);
//     watchChart.data.datasets[0].data.push(distance);
//     watchChart.update();
    
//     // Calculate proximity score (0-1)
//     const proximityScore = Math.max(0, 1 - (distance / 10));
    
//     return proximityScore;
// }

// function calculateDrift() {
//     // Simulate feature drift
//     const drift = Math.random() * 0.3;
    
//     // Update drift chart
//     const timestamp = new Date().toLocaleTimeString();
//     if (driftChart.data.labels.length > 10) {
//         driftChart.data.labels.shift();
//         driftChart.data.datasets[0].data.shift();
//     }
//     driftChart.data.labels.push(timestamp);
//     driftChart.data.datasets[0].data.push(drift);
//     driftChart.update();
    
//     return drift;
// }

// // Calculate overall trust score
// function calculateTrustScore() {
//     const wifiStability = collectWiFiData();
//     const audioConsistency = collectAudioData();
//     const watchProximity = collectWatchData();
//     const featureDrift = calculateDrift();
    
//     // Weighted trust score calculation
//     const trustScore = (wifiStability * 0.3) + 
//                       (audioConsistency * 0.3) + 
//                       (watchProximity * 0.3) - 
//                       (featureDrift * 0.3);
    
//     return Math.max(0, Math.min(1, trustScore));
// }

// // Update decision histogram
// function updateHistogram(decision) {
//     const index = ['ALLOW', 'CHALLENGE', 'BLOCK'].indexOf(decision);
//     if (index !== -1) {
//         histChart.data.datasets[0].data[index]++;
//         histChart.update();
//     }
// }

// // Load decision history
// async function loadDecisions() {
//     try {
//         const response = await fetch(`${API_BASE}/user/decisions/1`); // Using user ID 1 for demo
//         if (response.ok) {
//             const decisions = await response.json();
//             const tbody = document.getElementById('decisionsBody');
//             tbody.innerHTML = '';
            
//             decisions.forEach(d => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${new Date(d.timestamp).toLocaleString()}</td>
//                     <td>${d.trust.toFixed(2)}</td>
//                     <td>${d.result}</td>
//                     <td>${d.note || ''}</td>
//                 `;
//                 tbody.appendChild(row);
//             });
//         }
//     } catch (error) {
//         console.error('Error loading decisions:', error);
//     }
// }

// // Make authentication decision
// async function makeDecision(trustScore) {
//     try {
//         const response = await fetch(`${API_BASE}/auth/decision`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 user_id: 1, // Using user ID 1 for demo
//                 trust: trustScore
//             })
//         });
        
//         const data = await response.json();
//         if (response.ok) {
//             // Update decisions table
//             loadDecisions();
            
//             // Update histogram
//             updateHistogram(data.result);
            
//             return data;
//         }
//     } catch (error) {
//         console.error('Decision error:', error);
//     }
// }

// // Start streaming trust data
// function startStream() {
//     if (isStreaming) return;
    
//     isStreaming = true;
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = 'active';
//     statusElement.className = 'status safe';
    
//     document.getElementById('btnStart').classList.add('ghost');
//     document.getElementById('btnStop').classList.remove('ghost');
    
//     // Clear any existing interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//     }
    
//     // Start collecting data every 2 seconds
//     updateInterval = setInterval(async () => {
//         if (!isStreaming) {
//             clearInterval(updateInterval);
//             return;
//         }
        
//         // Calculate trust score
//         const trustScore = calculateTrustScore();
//         trustData.push({
//             timestamp: new Date().toISOString(),
//             score: trustScore
//         });
        
//         // Update UI
//         document.getElementById('trustScore').textContent = trustScore.toFixed(2);
        
//         // Update trust chart
//         if (trustChart) {
//             const now = new Date();
//             const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
            
//             // Keep only last 20 data points
//             if (trustChart.data.labels.length > 20) {
//                 trustChart.data.labels.shift();
//                 trustChart.data.datasets[0].data.shift();
//             }
            
//             trustChart.data.labels.push(timeLabel);
//             trustChart.data.datasets[0].data.push(trustScore);
//             trustChart.update('none');
//         }
        
//         // Make authentication decision every 10 seconds (every 5th update)
//         if (trustData.length % 5 === 0) {
//             await makeDecision(trustScore);
//         }
        
//     }, 2000); // Update every 2 seconds
// }

// // Stop streaming
// function stopStream() {
//     isStreaming = false;
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = 'stopped';
//     statusElement.className = 'status';
    
//     document.getElementById('btnStart').classList.remove('ghost');
//     document.getElementById('btnStop').classList.add('ghost');
    
//     // Clear the update interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//         updateInterval = null;
//     }
// }

// // Initialize when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize all charts
//     initCharts();
    
//     // Load initial decisions
//     loadDecisions();
    
//     // Add event listeners to buttons
//     document.getElementById('btnStart').addEventListener('click', startStream);
//     document.getElementById('btnStop').addEventListener('click', stopStream);
    
//     // Set initial button states
//     document.getElementById('btnStop').classList.add('ghost');
// });

// const API_BASE = "http://127.0.0.1:5000/api";
// let isStreaming = false;
// let updateInterval;

// console.log("✅ app.js is loaded!");

// // Simple debug function to show we're running
// function debugLog(message) {
//     console.log(message);
//     const now = new Date().toLocaleTimeString();
//     document.getElementById('trustScore').textContent = now + " - " + message;
// }

// // Initialize charts with simple placeholders
// function initCharts() {
//     console.log("📊 Charts initialized (placeholder)");
    
//     // Just create simple chart containers for now
//     const charts = ['trustChart', 'wifiChart', 'audioChart', 'watchChart', 'driftChart', 'histChart'];
//     charts.forEach(chartId => {
//         const canvas = document.getElementById(chartId);
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             ctx.fillStyle = '#f0f0f0';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//             ctx.fillStyle = '#666';
//             ctx.font = '12px Arial';
//             ctx.fillText('Chart: ' + chartId, 10, 20);
//         }
//     });
// }

// // Start streaming trust data - SIMPLIFIED VERSION
// function startStream() {
//     if (isStreaming) return;
    
//     console.log("▶️ Starting stream...");
//     isStreaming = true;
    
//     // Update UI
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = 'active';
//     statusElement.className = 'status safe';
    
//     document.getElementById('btnStart').classList.add('ghost');
//     document.getElementById('btnStop').classList.remove('ghost');
    
//     // Clear any existing interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//     }
    
//     let counter = 0;
    
//     // Start simple data generation every second
//     updateInterval = setInterval(() => {
//         if (!isStreaming) return;
        
//         counter++;
//         const trustScore = (Math.sin(counter * 0.2) + 1) / 2; // Oscillating value 0-1
        
//         // Update trust score display
//         document.getElementById('trustScore').textContent = trustScore.toFixed(2);
        
//         // Update status every 5 seconds
//         if (counter % 5 === 0) {
//             let result, note;
//             if (trustScore > 0.7) {
//                 result = "ALLOW";
//                 note = "Good trust score";
//             } else if (trustScore > 0.4) {
//                 result = "CHALLENGE";
//                 note = "Medium trust score";
//             } else {
//                 result = "BLOCK";
//                 note = "Low trust score";
//             }
            
//             // Add to decisions table
//             const tbody = document.getElementById('decisionsBody');
//             const row = document.createElement('tr');
//             const now = new Date().toLocaleTimeString();
            
//             row.innerHTML = `
//                 <td>${now}</td>
//                 <td>${trustScore.toFixed(2)}</td>
//                 <td>${result}</td>
//                 <td>${note}</td>
//             `;
            
//             // Add to beginning of table
//             if (tbody.firstChild) {
//                 tbody.insertBefore(row, tbody.firstChild);
//             } else {
//                 tbody.appendChild(row);
//             }
            
//             // Keep only last 10 decisions
//             while (tbody.children.length > 10) {
//                 tbody.removeChild(tbody.lastChild);
//             }
            
//             console.log(`Decision: ${result} (${trustScore.toFixed(2)})`);
//         }
        
//         console.log(`Update #${counter}: ${trustScore.toFixed(2)}`);
        
//     }, 1000); // Update every second
// }

// // Stop streaming
// function stopStream() {
//     console.log("⏹️ Stopping stream...");
//     isStreaming = false;
    
//     // Update UI
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = 'stopped';
//     statusElement.className = 'status';
    
//     document.getElementById('btnStart').classList.remove('ghost');
//     document.getElementById('btnStop').classList.add('ghost');
    
//     // Clear the update interval
//     if (updateInterval) {
//         clearInterval(updateInterval);
//         updateInterval = null;
//     }
// }

// // Initialize when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("🚀 DOM loaded, initializing...");
    
//     // Initialize simple charts
//     initCharts();
    
//     // Add event listeners to buttons
//     const startBtn = document.getElementById('btnStart');
//     const stopBtn = document.getElementById('btnStop');
    
//     if (startBtn && stopBtn) {
//         startBtn.addEventListener('click', startStream);
//         stopBtn.addEventListener('click', stopStream);
//         console.log("✅ Button listeners added");
        
//         // Set initial button states
//         stopBtn.classList.add('ghost');
//     } else {
//         console.error("❌ Buttons not found!");
//         if (!startBtn) console.error("Missing #btnStart");
//         if (!stopBtn) console.error("Missing #btnStop");
//     }
    
//     // Show initial status
//     debugLog("Ready to start streaming");
// });

const API_BASE = "http://127.0.0.1:5000/api";
let isStreaming = false;
let updateInterval;
let trustChart, wifiChart, audioChart, watchChart, driftChart, histChart;

console.log("✅ app.js is loaded!");

// Initialize all charts
function initCharts() {
    console.log("📊 Initializing charts...");
    
    // Trust Score Chart
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
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: { display: false }
                },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    // WiFi RSSI Chart
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
                y: { 
                    reverse: true,
                    min: -90,
                    max: -30,
                    grid: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Audio MFCC Chart
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
                y: { 
                    min: 0,
                    max: 4,
                    grid: { display: false }
                },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Watch Proximity Chart
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
                y: {
                    min: 0,
                    max: 10,
                    grid: { display: false }
                },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Feature Drift Chart
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
                y: {
                    min: 0,
                    max: 1,
                    grid: { display: false }
                },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Decision Histogram
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

// Update WiFi data
function updateWiFiData() {
    const newData = wifiChart.data.datasets[0].data.map(value => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(-90, Math.min(-30, value + change));
    });
    wifiChart.data.datasets[0].data = newData;
    wifiChart.update();
    
    return Math.random() * 0.2 + 0.7; // Return WiFi stability score
}

// Update Audio data
function updateAudioData() {
    const newData = audioChart.data.datasets[0].data.map(value => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(0.5, Math.min(3.5, value + change));
    });
    audioChart.data.datasets[0].data = newData;
    audioChart.update();
    
    return Math.random() * 0.2 + 0.6; // Return audio consistency score
}

// Update Watch data
function updateWatchData() {
    const distance = Math.random() * 8 + 1; // 1-9 meters
    const timestamp = new Date().toLocaleTimeString();
    
    // Update watch chart
    if (watchChart.data.labels.length > 8) {
        watchChart.data.labels.shift();
        watchChart.data.datasets[0].data.shift();
    }
    watchChart.data.labels.push(timestamp);
    watchChart.data.datasets[0].data.push(distance);
    watchChart.update();
    
    return Math.max(0, 1 - (distance / 10)); // Return proximity score
}

// Update Drift data
function updateDriftData() {
    const drift = Math.random() * 0.3;
    const timestamp = new Date().toLocaleTimeString();
    
    // Update drift chart
    if (driftChart.data.labels.length > 8) {
        driftChart.data.labels.shift();
        driftChart.data.datasets[0].data.shift();
    }
    driftChart.data.labels.push(timestamp);
    driftChart.data.datasets[0].data.push(drift);
    driftChart.update();
    
    return drift; // Return drift score
}

// Update histogram
function updateHistogram(decision) {
    const index = ['ALLOW', 'CHALLENGE', 'BLOCK'].indexOf(decision);
    if (index !== -1) {
        histChart.data.datasets[0].data[index]++;
        histChart.update();
    }
}

// Make authentication decision
async function makeDecision(trustScore) {
    try {
        const response = await fetch(`${API_BASE}/auth/decision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: 1, // Using user ID 1 for demo
                trust: trustScore
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update decisions table
        loadDecisions();
        
        // Update histogram
        updateHistogram(data.result);
        
        console.log(`✅ Decision saved: ${data.result}`);
        return data;
        
    } catch (error) {
        console.error('❌ Decision error:', error);
        // Fallback: Create decision locally if backend fails
        let result, note;
        if (trustScore > 0.7) {
            result = "ALLOW";
            note = "Normal behavior pattern";
        } else if (trustScore > 0.4) {
            result = "CHALLENGE";
            note = "Additional verification required";
        } else {
            result = "BLOCK";
            note = "Suspicious activity detected";
        }
        
        // Update histogram locally
        updateHistogram(result);
        
        return { result, note, trust: trustScore };
    }
}
// Start streaming trust data
function startStream() {
    if (isStreaming) return;
    
    console.log("▶️ Starting stream...");
    isStreaming = true;
    
    // Update UI
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'active';
    statusElement.className = 'status safe';
    
    document.getElementById('btnStart').classList.add('ghost');
    document.getElementById('btnStop').classList.remove('ghost');
    
    // Clear any existing interval
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    let counter = 0;
    
    // Start data generation every 2 seconds
    updateInterval = setInterval(() => {
        if (!isStreaming) return;
        
        counter++;
        
        // Update all sensor data
        const wifiScore = updateWiFiData();
        const audioScore = updateAudioData();
        const watchScore = updateWatchData();
        const driftScore = updateDriftData();
        
        // Calculate trust score (weighted average)
        const trustScore = (wifiScore * 0.3) + (audioScore * 0.3) + (watchScore * 0.3) - (driftScore * 0.3);
        const finalTrustScore = Math.max(0, Math.min(1, trustScore));
        
        // Update trust score display
        document.getElementById('trustScore').textContent = finalTrustScore.toFixed(2);
        
        // Update trust chart
        const now = new Date();
        const timeLabel = `${now.getMinutes()}:${now.getSeconds()}`;
        
        if (trustChart.data.labels.length > 15) {
            trustChart.data.labels.shift();
            trustChart.data.datasets[0].data.shift();
        }
        trustChart.data.labels.push(timeLabel);
        trustChart.data.datasets[0].data.push(finalTrustScore);
        trustChart.update('none');
        
        // Make decision every 10 seconds (every 5th update)
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
            
            // Add to decisions table
            const tbody = document.getElementById('decisionsBody');
            const row = document.createElement('tr');
            const nowTime = new Date().toLocaleTimeString();
            
            row.innerHTML = `
                <td>${nowTime}</td>
                <td>${finalTrustScore.toFixed(2)}</td>
                <td>${result}</td>
                <td>${note}</td>
            `;
            
            // Add to beginning of table
            if (tbody.firstChild) {
                tbody.insertBefore(row, tbody.firstChild);
            } else {
                tbody.appendChild(row);
            }
            
            // Keep only last 10 decisions
            while (tbody.children.length > 10) {
                tbody.removeChild(tbody.lastChild);
            }
            
            // Update histogram
            updateHistogram(result);
            
            console.log(`Decision: ${result} (${finalTrustScore.toFixed(2)})`);
            
            // Send to backend (optional)
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
        
        console.log(`Update #${counter}: ${finalTrustScore.toFixed(2)}`);
        
    }, 2000); // Update every 2 seconds
}

// Stop streaming
function stopStream() {
    console.log("⏹️ Stopping stream...");
    isStreaming = false;
    
    // Update UI
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'stopped';
    statusElement.className = 'status';
    
    document.getElementById('btnStart').classList.remove('ghost');
    document.getElementById('btnStop').classList.add('ghost');
    
    // Clear the update interval
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}



// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM loaded, initializing...");
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error("❌ Chart.js not loaded! Add: <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>");
        return;
    }
    
    // Initialize charts
    initCharts();
    
    // Add event listeners to buttons
    const startBtn = document.getElementById('btnStart');
    const stopBtn = document.getElementById('btnStop');
    
    if (startBtn && stopBtn) {
        startBtn.addEventListener('click', startStream);
        stopBtn.addEventListener('click', stopStream);
        console.log("✅ Button listeners added");
        
        // Set initial button states
        stopBtn.classList.add('ghost');
    } else {
        console.error("❌ Buttons not found!");
    }
    
    console.log("✅ System ready - click 'Start Stream' to begin");
});
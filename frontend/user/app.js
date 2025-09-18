
// // ---------------- Config ----------------
// const CFG = {
//   wifiIntervalSec: 60,
//   audioIntervalSec: 300,
//   watchIntervalSec: 30,
//   trustMin: 0.65,
//   watchProxMaxMeters: 3.0
// };

// // --------- Utility ---------
// const $ = (sel)=>document.querySelector(sel);
// function fmtTime(t){ return new Date(t).toLocaleTimeString(); }
// function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

// // Simple sparkline-like chart renderer
// function renderLineChart(canvas, data, opts = {}){
//   const ctx = canvas.getContext('2d');
//   const w = canvas.width = canvas.clientWidth;
//   const h = canvas.height = canvas.clientHeight;
//   ctx.clearRect(0,0,w,h);
//   const pad = 20;
//   const X = (i)=> pad + (w-2*pad) * (i/(data.length-1||1));
//   const min = Math.min(...data), max = Math.max(...data);
//   const Y = (v)=> h-pad - (h-2*pad) * ((v-min)/((max-min)||1));
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   data.forEach((v,i)=>{
//     const x = X(i), y = Y(v);
//     if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
//   });
//   ctx.strokeStyle = "#5b8cff";
//   ctx.stroke();
//   // points
//   ctx.fillStyle = "#9ab7ff";
//   data.forEach((v,i)=> ctx.fillRect(X(i)-2, Y(v)-2, 4, 4));
// }

// function renderBars(canvas, buckets){
//   const ctx = canvas.getContext('2d');
//   const w = canvas.width = canvas.clientWidth;
//   const h = canvas.height = canvas.clientHeight;
//   ctx.clearRect(0,0,w,h);
//   const pad = 24;
//   const bw = (w-2*pad)/buckets.length;
//   const max = Math.max(...buckets.map(b=>b.v),1);
//   buckets.forEach((b,i)=>{
//     const x = pad + i*bw + 6;
//     const bh = (h-2*pad) * (b.v/max);
//     ctx.fillStyle = "#5b8cff";
//     ctx.fillRect(x, h-pad-bh, bw-12, bh);
//     ctx.fillStyle = "#c7d6f5";
//     ctx.fillText(b.k, x, h-8);
//   });
// }

// // -------------- Data Fetch (mock) --------------
// // BACKEND INTEGRATION: replace these with real endpoints.
// async function pullLatestMetrics(){
//   const wf = await fetch('sample_data/wifi_scans.json').then(r=>r.json());
//   const au = await fetch('sample_data/audio_stats.json').then(r=>r.json());
//   const dc = await fetch('sample_data/decisions.json').then(r=>r.json());
//   return {wf, au, dc};
// }

// async function pullRecentDecisions(){ return (await fetch('sample_data/decisions.json').then(r=>r.json())).items; }
// async function pullStreamConfig(){ return CFG; }

// // -------------- Simulators --------------
// let simTimer=null;
// let trustSeries=[], wifiSeries=[], audioSeries=[], watchSeries=[], driftSeries=[], hist={safe:0, anomalous:0};

// function simulateTick(){
//   // Wi‑Fi fingerprint stability ~ RSSI average (higher magnitude negative)
//   const rssi = -50 - Math.random()*25;
//   wifiSeries.push(rssi); if(wifiSeries.length>40) wifiSeries.shift();

//   // Audio MFCC entropy [0.4..0.9]
//   const entropy = 0.5 + Math.random()*0.5 + (Math.random()<0.1?0.15:0);
//   audioSeries.push(entropy); if(audioSeries.length>40) audioSeries.shift();

//   // Watch proximity in meters
//   const prox = Math.max(0, (Math.random()*4) + (Math.random()<0.2?2:0));
//   watchSeries.push(prox); if(watchSeries.length>40) watchSeries.shift();

//   // Simple drift: normalized variance of the three inputs
//   const drift = (Math.abs(rssi+60)/25 + Math.abs(entropy-0.6)/0.4 + Math.abs(prox-1.5)/3.5)/3;
//   driftSeries.push(drift); if(driftSeries.length>40) driftSeries.shift();

//   // Trust: inverse of drift with floor
//   let trust = clamp(1 - drift, 0, 1);
//   if(prox > CFG.watchProxMaxMeters) trust -= 0.3;
//   trust = clamp(trust, 0, 1);
//   trustSeries.push(trust); if(trustSeries.length>60) trustSeries.shift();

//   const result = trust >= CFG.trustMin ? "safe" : "anomalous";
//   hist[result]++;

//   // Render
//   renderLineChart($('#trustChart'), trustSeries);
//   renderLineChart($('#wifiChart'), wifiSeries);
//   renderLineChart($('#audioChart'), audioSeries);
//   renderLineChart($('#watchChart'), watchSeries);
//   renderLineChart($('#driftChart'), driftSeries);
//   renderBars($('#histChart'), [{k:'safe', v:hist.safe},{k:'anom', v:hist.anomalous}]);

//   $('#trustScore').textContent = trust.toFixed(2);
//   $('#status').textContent = result;
//   $('#status').className = 'status ' + result;

//   // table row
//   const row = document.createElement('tr');
//   const now = new Date().toLocaleTimeString();
//   row.innerHTML = `<td>${now}</td><td>${trust.toFixed(2)}</td><td>${result}</td><td>${prox>CFG.watchProxMaxMeters?'Watch far':'OK'}</td>`;
//   const tbody = $('#decisionsBody');
//   tbody.prepend(row);
//   while(tbody.children.length>12) tbody.removeChild(tbody.lastChild);
// }

// function startSim(){
//   if(simTimer) return;
//   $('#status').textContent = 'running';
//   simTimer = setInterval(simulateTick, 1200);
// }
// function stopSim(){
//   if(simTimer){ clearInterval(simTimer); simTimer=null; }
//   $('#status').textContent = 'stopped';
// }

// // -------------- Init --------------
// (async function init(){
//   const cfg = await pullStreamConfig();
//   $('#cfgWifiInt').textContent = cfg.wifiIntervalSec+'s';
//   $('#cfgAudioInt').textContent = cfg.audioIntervalSec+'s';
//   $('#cfgWatchInt').textContent = cfg.watchIntervalSec+'s';
//   $('#cfgTrust').textContent = cfg.trustMin.toFixed(2);
//   $('#cfgProx').textContent = cfg.watchProxMaxMeters.toFixed(1);

//   // load seed tables
//   const items = await pullRecentDecisions();
//   const tbody = $('#decisionsBody');
//   items.forEach(x=>{
//     const tr = document.createElement('tr');
//     tr.innerHTML = `<td>${fmtTime(x.timestamp)}</td><td>${x.trust.toFixed(2)}</td><td>${x.result}</td><td>${x.note||''}</td>`;
//     tbody.appendChild(tr);
//   });

//   $('#btnStart').addEventListener('click', startSim);
//   $('#btnStop').addEventListener('click', stopSim);
// })();

// const API_BASE = "http://192.168.1.3:5000/api";

// // Load user metrics
// async function loadMetrics() {
//   try {
//     const res = await fetch(`${API_BASE}/user/metrics/1`); // Example: user_id = 1
//     if (!res.ok) throw new Error("Failed to fetch metrics");
//     const data = await res.json();

//     document.getElementById("wifi").innerText = `Wi-Fi RSSI: ${data.wifi_rssi}`;
//     document.getElementById("audio").innerText = `Audio Entropy: ${data.audio_entropy}`;
//     document.getElementById("watch").innerText = `Watch Proximity: ${data.watch_proximity}`;
//   } catch (err) {
//     console.error("Error fetching metrics:", err);
//   }
// }

// // Load user decisions
// async function loadDecisions() {
//   try {
//     const res = await fetch(`${API_BASE}/user/decisions/1`); // Example: user_id = 1
//     if (!res.ok) throw new Error("Failed to fetch decisions");
//     const data = await res.json();

//     document.getElementById("decision").innerText =
//       `Access: ${data.decision} (Trust Score: ${data.trust_score})`;
//   } catch (err) {
//     console.error("Error fetching decisions:", err);
//   }
// }

// // Refresh dashboard every 5s
// setInterval(() => {
//   loadMetrics();
//   loadDecisions();
// }, 5000);

// // Run once on load
// loadMetrics();
// loadDecisions();
// ---------------- Config ----------------
const API_BASE = "http://127.0.0.1:5000/api";
const CFG = {
  wifiIntervalSec: 60,
  audioIntervalSec: 300,
  watchIntervalSec: 30,
  trustMin: 0.65,
  watchProxMaxMeters: 3.0
};

// --------- Utility ---------
const $ = (sel)=>document.querySelector(sel);
function fmtTime(t){ return new Date(t).toLocaleTimeString(); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

// Chart renderers (same as before)
function renderLineChart(canvas, data, opts = {}) { const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  const pad = 20;
  const X = (i)=> pad + (w-2*pad) * (i/(data.length-1||1));
  const min = Math.min(...data), max = Math.max(...data);
  const Y = (v)=> h-pad - (h-2*pad) * ((v-min)/((max-min)||1));
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = X(i), y = Y(v);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.strokeStyle = "#5b8cff";
  ctx.stroke();
  // points
  ctx.fillStyle = "#9ab7ff";
  data.forEach((v,i)=> ctx.fillRect(X(i)-2, Y(v)-2, 4, 4));
}
function renderBars(canvas, buckets) { 
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  const pad = 24;
  const bw = (w-2*pad)/buckets.length;
  const max = Math.max(...buckets.map(b=>b.v),1);
  buckets.forEach((b,i)=>{
    const x = pad + i*bw + 6;
    const bh = (h-2*pad) * (b.v/max);
    ctx.fillStyle = "#5b8cff";
    ctx.fillRect(x, h-pad-bh, bw-12, bh);
    ctx.fillStyle = "#c7d6f5";
    ctx.fillText(b.k, x, h-8);
  });
}

// -------------- Backend Data Fetch --------------
async function pullLatestMetrics() {
  try {
    const res = await fetch(`${API_BASE}/user/metrics/1`);
    if (!res.ok) throw new Error("Failed to fetch metrics");
    return await res.json();
  } catch (e) {
    console.error("Metrics fetch failed:", e);
    return null;
  }
}

// Fetch decisions for a given user from backend
async function pullRecentDecisions(userId = 2) {   // default user_id=2 (Maha)
  try {
    const res = await fetch(`/api/user/decisions/${userId}`);
    const data = await res.json();

    // If backend returns {items: [...]}, normalize
    if (data.items) return data.items;

    // Otherwise backend returned raw rows
    return data.map(d => ({
      timestamp: d.created_at || d.timestamp,
      trust: d.trust_score || d.trust,
      result: d.result,
      note: d.note
    }));
  } catch (err) {
    console.error("Error fetching decisions:", err);
    return [];
  }
}

async function pullUserDecision() {
  try {
    const res = await fetch(`${API_BASE}/user/decisions/1`);
    if (!res.ok) throw new Error("Failed to fetch decision");
    return await res.json();
  } catch (e) {
    console.error("Decision fetch failed:", e);
    return null;
  }
}

// -------------- Stream Loop --------------
let streamTimer = null;
let trustSeries=[], wifiSeries=[], audioSeries=[], watchSeries=[], driftSeries=[], hist={safe:0, anomalous:0};

async function streamTick() {
  const metrics = await pullLatestMetrics();
  const decision = await pullUserDecision();
  if (!metrics || !decision) return;

  const rssi = metrics.wifi_rssi;
  const entropy = metrics.audio_entropy;
  const prox = metrics.watch_proximity;
  const trust = decision.trust_score;
  const result = decision.decision.toLowerCase();

  // push series data
  wifiSeries.push(rssi); if(wifiSeries.length>40) wifiSeries.shift();
  audioSeries.push(entropy); if(audioSeries.length>40) audioSeries.shift();
  watchSeries.push(prox); if(watchSeries.length>40) watchSeries.shift();
  trustSeries.push(trust); if(trustSeries.length>60) trustSeries.shift();

  hist[result]++;

  // render charts
  renderLineChart($('#trustChart'), trustSeries);
  renderLineChart($('#wifiChart'), wifiSeries);
  renderLineChart($('#audioChart'), audioSeries);
  renderLineChart($('#watchChart'), watchSeries);
  renderBars($('#histChart'), [{k:'safe', v:hist.safe},{k:'anom', v:hist.anomalous}]);

  $('#trustScore').textContent = trust.toFixed(2);
  $('#status').textContent = result;
  $('#status').className = 'status ' + result;

  // add table row
  const row = document.createElement('tr');
  row.innerHTML = `<td>${fmtTime(Date.now())}</td><td>${trust.toFixed(2)}</td><td>${result}</td><td>${prox>CFG.watchProxMaxMeters?'Watch far':'OK'}</td>`;
  const tbody = $('#decisionsBody');
  tbody.prepend(row);
  while(tbody.children.length>12) tbody.removeChild(tbody.lastChild);
}

function startStream() {
  if (streamTimer) return;
  $('#status').textContent = 'running';
  streamTimer = setInterval(streamTick, 3000); // every 3s
}
function stopStream() {
  if (streamTimer) {
    clearInterval(streamTimer);
    streamTimer = null;
  }
  $('#status').textContent = 'stopped';
}

// -------------- Init --------------
(async function init(){
  // Load config
  const cfg = await pullStreamConfig();
  $('#cfgWifiInt').textContent = cfg.wifiIntervalSec+'s';
  $('#cfgAudioInt').textContent = cfg.audioIntervalSec+'s';
  $('#cfgWatchInt').textContent = cfg.watchIntervalSec+'s';
  $('#cfgTrust').textContent = cfg.trustMin.toFixed(2);
  $('#cfgProx').textContent = cfg.watchProxMaxMeters.toFixed(1);

  // Load decisions once (NOT in real-time)
  const items = await pullRecentDecisions(2); // user_id=2 (Maha)
  const tbody = $('#decisionsBody');

  items.forEach(x => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fmtTime(x.timestamp)}</td>
      <td>${x.trust.toFixed(2)}</td>
      <td>${x.result}</td>
      <td>${x.note || ''}</td>
    `;
    tbody.appendChild(tr);
  });

  // Buttons to start/stop simulator (if needed)
  $('#btnStart').addEventListener('click', startStream);
  $('#btnStop').addEventListener('click', stopStream);
})();
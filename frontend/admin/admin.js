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
const API_BASE = "http://127.0.0.1:5000/api";  

// --------- Utility ---------
function fmtTime(t) {
  return new Date(t).toLocaleTimeString();
}

// --------- Chart Setup (using Chart.js) ---------
let trustChart, decisionPie;

function initCharts() {
  const trustCtx = document.getElementById("trustTrend").getContext("2d");
  trustChart = new Chart(trustCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Trust Score",
        data: [],
        borderColor: "#5b8cff",
        fill: false
      }]
    },
    options: { responsive: true, scales: { y: { min: 0, max: 1 } } }
  });

  const pieCtx = document.getElementById("decisionPie").getContext("2d");
  decisionPie = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Safe", "Anomalous"],
      datasets: [{
        data: [0, 0],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    },
    options: { responsive: true }
  });
}

// --------- Load Users ---------
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/user`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const users = await res.json();

    const table = document.getElementById("usersBody");
    table.innerHTML = "";
    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.device}</td>
      `;
      table.appendChild(row);
    });

  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

// --------- Load Decisions ---------
async function loadDecisions() {
  try {
    const res = await fetch(`${API_BASE}/admin/decisions`);
    if (!res.ok) throw new Error("Failed to fetch decisions");
    const decisions = await res.json();

    const table = document.getElementById("decisionsBody");
    table.innerHTML = "";

    let safeCount = 0, anomCount = 0;
    const trustScores = [], labels = [];

    decisions.forEach(dec => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dec.user_id}</td>
        <td>${dec.decision}</td>
        <td>${dec.trust_score.toFixed(2)}</td>
        <td>${fmtTime(dec.timestamp)}</td>
      `;
      table.appendChild(row);

      // graph data
      trustScores.push(dec.trust_score);
      labels.push(fmtTime(dec.timestamp));
      if (dec.decision === "ALLOW") safeCount++; else anomCount++;
    });

    // update line chart
    trustChart.data.labels = labels;
    trustChart.data.datasets[0].data = trustScores;
    trustChart.update();

    // update pie chart
    decisionPie.data.datasets[0].data = [safeCount, anomCount];
    decisionPie.update();

  } catch (err) {
    console.error("Error fetching decisions:", err);
  }
}

// --------- Auto Refresh ---------
function refreshAdminData() {
  loadUsers();
  loadDecisions();
}

// --------- Init ---------
window.onload = function() {
  initCharts();
  refreshAdminData();
  setInterval(refreshAdminData, 5000);
};



const MISSION =
  "To improve safety using AI-driven detection systems.";

const VISION =
  "To build a safer world using smart predictive security tools.";

const USER = "admin";
const PASS = "1234";

/* ========================================================
   API KEYS — Replace these with your real keys
   VirusTotal : https://www.virustotal.com/gui/sign-in
   AbuseIPDB  : https://www.abuseipdb.com/register
   NewsAPI    : https://newsapi.org/register
======================================================== */
const VIRUSTOTAL_KEY = "9c060272f4cb4bea84063b58d2c1e1997728b309bb36e3be5b2bd7568a995da2";
const ABUSEIPDB_KEY  = "4f6b95b3b734f9ce2d1ff26f512c436460844deb1e8c362e900cf733c4145888cd7d1edf558a3612";
const NEWS_KEY       = "ecdfb5b18f1e493db81e3d849a33bc07";


/* ========= NAVIGATION ========= */

function showSection(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const page = document.getElementById(id);
  if (page) page.classList.add("active");

  if (id === "home") initHome();
  if (id === "dashboard") initDashboard();

  document.getElementById("navLinks")?.classList.remove("open");
}

/* ========= AUTH ========= */

function isLoggedIn() {
  return localStorage.getItem("login") === "true";
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const err = document.getElementById("error");

  if (!u || !p) {
    err.textContent = "Fill all fields";
    err.classList.remove("hidden");
    return;
  }

  if (u === USER && p === PASS) {
    localStorage.setItem("login", "true");
    localStorage.setItem("user", u);
    showSection("dashboard");
    updateNav();
  } else {
    err.textContent = "Wrong credentials";
    err.classList.remove("hidden");
  }
}

function logout() {
  localStorage.clear();
  showSection("home");
  updateNav();
}

function updateNav() {
  const loginBtn = document.getElementById("loginBtn");
  const dashBtn = document.getElementById("dashBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (isLoggedIn()) {
    loginBtn?.classList.add("hidden");
    dashBtn?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");
  } else {
    loginBtn?.classList.remove("hidden");
    dashBtn?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
  }
}

/* ========= HOME ========= */

function initHome() {
  document.getElementById("missionText").textContent = MISSION;
  document.getElementById("visionText").textContent = VISION;

  fetchWeather("weatherBox");
}

/* ========= DASHBOARD ========= */

function initDashboard() {
  document.getElementById("user").textContent =
    localStorage.getItem("user") || "Admin";

  setInterval(() => {
    const t = new Date();
    document.getElementById("time").textContent = t.toLocaleTimeString();
  }, 1000);

  //Call all APIs
    fetchWeather("dashWeather");  //API 1 -Open-Meteo
    fetchIPInfo("ipBox");                // API 2 — IPInfo
    fetchSecurityNews("newsBox");          // API 5 — NewsAPI
}
}

/* ========= TTC CALC ========= */

function calcTTC(speedId, distId, outId) {
  const s = parseFloat(document.getElementById(speedId).value);
  const d = parseFloat(document.getElementById(distId).value);

  if (!s || !d) return alert("Invalid input");

  const ttc = d / s;

  document.getElementById(outId).textContent =
    `TTC: ${ttc.toFixed(2)}s`;
}

/* ========= WEATHER ========= */

async function fetchWeather(id) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = "Loading...";

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-1.29&longitude=36.82&current=temperature_2m,wind_speed_10m,relative_humidity_2m"
    );

    const data = await res.json();
    const c = data.current;

    box.innerHTML = `
      <p>Temp: ${c.temperature_2m}°C</p>
      <p>Wind: ${c.wind_speed_10m} m/s</p>
      <p>Humidity: ${c.relative_humidity_2m}%</p>
    `;
  } catch {
    box.innerHTML = "Weather failed to load";
  }
}

/* ========= EVENT LISTENERS ========= */

document.addEventListener("DOMContentLoaded", () => {

  // Initial setup
  updateNav();
  initHome();

  // Navigation
  document.getElementById("homeBtn")?.addEventListener("click", () => showSection("home"));
  document.getElementById("loginBtn")?.addEventListener("click", () => showSection("login"));
  document.getElementById("dashBtn")?.addEventListener("click", () => showSection("dashboard"));
  document.getElementById("logoutBtn")?.addEventListener("click", logout);

  // Login form
  document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  // Optional: allow Enter key to login
  document.getElementById("password")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") login();
  });

  // TTC button
  document.getElementById("ttcBtn")?.addEventListener("click", () => {
    calcTTC("speedInput", "distanceInput", "ttcOutput");
  });

  // Mobile menu toggle
  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.getElementById("navLinks")?.classList.toggle("open");
  });

});
document.querySelector("form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll("form input");
  const username = inputs[0].value;
  const email = inputs[1].value;
  const password = inputs[2].value;
  const confirm = inputs[3].value;

  if (!username || !email || !password || !confirm) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  // Save user (simple version)
  localStorage.setItem("user", username);

  alert("Account created successfully!");

  // Optional: redirect
  // window.location.href = "login.html";
});
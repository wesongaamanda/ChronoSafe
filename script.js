/*  CONFIG  */
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhkOWJhYjI4YTVmNzRlNTZiM2UwOTBhMGE5OWE2NGE0IiwiaCI6Im11cm11cjY0In0=";
/*  STORAGE HELPERS  */
function getUsers() {
  return JSON.parse(localStorage.getItem("cs_users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("cs_users", JSON.stringify(users));
}

function setSession(username) {
  localStorage.setItem("cs_session", username);
}

function getSession() {
  return localStorage.getItem("cs_session");
}

function clearSession() {
  localStorage.removeItem("cs_session");
}

/*  PAGE SWITCHING  */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId)?.classList.remove("hidden");
  if (pageId === "trackingPage") initMap();
}

function switchTo(authPageId) {
  document.querySelectorAll(".auth-page").forEach(p => p.classList.add("hidden"));
  document.getElementById(authPageId)?.classList.remove("hidden");
  clearErrors();
}

function showSite() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("mainSite").classList.remove("hidden");
  document.getElementById("mainNav").classList.remove("hidden");
  document.getElementById("mainFooter").classList.remove("hidden");
  document.getElementById("welcomeName").textContent = getSession();
  showPage("homePage");
}

function showAuth() {
  document.getElementById("auth").classList.remove("hidden");
  document.getElementById("mainSite").classList.add("hidden");
  document.getElementById("mainNav").classList.add("hidden");
  document.getElementById("mainFooter").classList.add("hidden");
  switchTo("loginPage");
}

/*  ERROR HELPERS  */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearErrors() {
  document.querySelectorAll(".error-msg").forEach(e => {
    e.textContent = "";
    e.classList.add("hidden");
  });
}

/*  AUTH  */
function login() {
  clearErrors();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    showError("loginError", "Please fill in all fields.");
    return;
  }

  const users = getUsers();

  if (!users[username]) {
    showError("loginError", "Account not found. Please sign up first.");
    return;
  }

  if (users[username].password !== password) {
    showError("loginError", "Incorrect password. Please try again.");
    return;
  }

  setSession(username);
  showSite();
}

function signup() {
  clearErrors();
  const username = document.getElementById("signupUsername").value.trim();
  const email    = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm  = document.getElementById("signupConfirm").value;

  if (!username || !email || !password || !confirm) {
    showError("signupError", "Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    showError("signupError", "Password must be at least 6 characters.");
    return;
  }

  if (password !== confirm) {
    showError("signupError", "Passwords do not match.");
    return;
  }

  const users = getUsers();

  if (users[username]) {
    showError("signupError", "Username already taken. Please choose another.");
    return;
  }

  users[username] = { email, password };
  saveUsers(users);
  setSession(username);
  showSite();
}

function logout() {
  clearSession();
  stopTracking();
  showAuth();
}

function googleAuth() {
  const mockName = "GoogleUser_" + Math.floor(Math.random() * 9000 + 1000);
  const users = getUsers();

  if (!users[mockName]) {
    users[mockName] = { email: mockName + "@gmail.com", password: "" };
    saveUsers(users);
  }

  setSession(mockName);
  showSite();
}

/*  MAP VARIABLES  */
let map = null;
let userMarker = null;
let accuracyCircle = null;
let routeLayer = null;
let watchId = null;
let userLatLng = null;
let routeCount = 0;

/*  INIT MAP  */
function initMap() {
  if (map) return;

  map = L.map("map").setView([1.2921, 36.8219], 13);

  // OpenStreetMap tiles — free, no key needed
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);
}

/*  LIVE TRACKING  */
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  document.getElementById("coordsDisplay").textContent = "Locating...";
  document.getElementById("accuracyDisplay").textContent = "";

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      userLatLng = [latitude, longitude];

      // Update coordinate display
      document.getElementById("coordsDisplay").textContent =
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      document.getElementById("accuracyDisplay").textContent =
        `Accuracy: ±${Math.round(accuracy)}m`;

      if (!map) initMap();

      // Update or place user marker
      if (userMarker) {
        userMarker.setLatLng(userLatLng);
      } else {
        userMarker = L.circleMarker(userLatLng, {
          radius: 10,
          fillColor: "#ffffff",
          color: "#000000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map).bindPopup("You are here");
      }

      // Update or draw accuracy circle
      if (accuracyCircle) {
        accuracyCircle.setLatLng(userLatLng).setRadius(accuracy);
      } else {
        accuracyCircle = L.circle(userLatLng, {
          radius: accuracy,
          color: "#ffffff",
          fillColor: "#ffffff",
          fillOpacity: 0.06,
          weight: 1
        }).addTo(map);
      }

      map.setView(userLatLng, 15);
    },
    (err) => {
      document.getElementById("coordsDisplay").textContent =
        "Location error: " + err.message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    document.getElementById("coordsDisplay").textContent = "Tracking stopped";
    document.getElementById("accuracyDisplay").textContent = "";
  }
}

/*  USE MY LOCATION AS ORIGIN  */
function useMyLocation() {
  if (!userLatLng) {
    alert("Start tracking first to get your current location.");
    return;
  }
  document.getElementById("originInput").value =
    `${userLatLng[0]},${userLatLng[1]}`;
}

/*  GEOCODE  */
async function geocode(query) {
  // If already coordinates like "-1.2921, 36.8219" use them directly
  const coordMatch = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
  }

  // Otherwise call Nominatim to convert place name to lat/lng
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: { "Accept-Language": "en" }
  });

  const data = await res.json();

  if (!data.length) {
    throw new Error(`Could not find location: "${query}"`);
  }

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

/*  GET DIRECTIONS  */
async function getDirections() {
  const originVal = document.getElementById("originInput").value.trim();
  const destVal   = document.getElementById("destInput").value.trim();

  document.getElementById("routeError").classList.add("hidden");

  if (!originVal || !destVal) {
    showError("routeError", "Please enter both origin and destination.");
    return;
  }

  if (!map) initMap();

  try {
    // Geocode both locations using Nominatim
    const [originCoords, destCoords] = await Promise.all([
      geocode(originVal),
      geocode(destVal)
    ]);

    // If no ORS key yet, draw a straight line as fallback
    if (ORS_API_KEY === "YOUR_ORS_API_KEY_HERE") {
      drawStraightLine(originCoords, destCoords);
      showError(
        "routeError",
        "Add your free ORS API key in script.js for real road directions. Showing straight line for now."
      );
      return;
    }

    // Call OpenRouteService for real road directions
    const orsUrl =
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const res = await fetch(orsUrl, {
      method: "POST",
      headers: {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinates: [
          [originCoords[1], originCoords[0]], // ORS uses [lng, lat]
          [destCoords[1],   destCoords[0]]
        ]
      })
    });

    if (!res.ok) {
      throw new Error("Directions API error: " + res.status);
    }

    const data = await res.json();
    drawRoute(data, originCoords, destCoords);

    // Update dashboard route counter
    routeCount++;
    const el = document.getElementById("routeCount");
    if (el) el.textContent = routeCount;

  } catch (err) {
    showError("routeError", err.message);
  }
}

/*  DRAW ROUTE FROM ORS RESPONSE  */
function drawRoute(geojson, originCoords, destCoords) {
  // Remove old route if there is one
  if (routeLayer) map.removeLayer(routeLayer);

  // Draw the route line
  routeLayer = L.geoJSON(geojson, {
    style: {
      color: "#ffffff",
      weight: 4,
      opacity: 0.85
    }
  }).addTo(map);

  // Fit map to show full route
  map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });

  // Add start and end markers
  L.marker(originCoords).addTo(map).bindPopup("Start").openPopup();
  L.marker(destCoords).addTo(map).bindPopup("Destination");

  // Show distance and duration
  const summary  = geojson.features[0].properties.summary;
  const distKm   = (summary.distance / 1000).toFixed(1);
  const durMin   = Math.round(summary.duration / 60);

  document.getElementById("routeDistance").textContent = distKm + " km";
  document.getElementById("routeDuration").textContent = durMin + " min";
  document.getElementById("routeInfoBlock").style.display = "flex";

  // Show turn-by-turn steps
  const steps = geojson.features[0].properties.segments[0].steps;
  const list  = document.getElementById("stepsList");
  list.innerHTML = "";

  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step.instruction;
    list.appendChild(li);
  });

  document.getElementById("stepsBlock").style.display = "flex";
}

/*  FALLBACK: STRAIGHT LINE (no ORS key)  */
function drawStraightLine(originCoords, destCoords) {
  if (routeLayer) map.removeLayer(routeLayer);

  routeLayer = L.polyline([originCoords, destCoords], {
    color: "#ffffff",
    weight: 3,
    dashArray: "8 6",
    opacity: 0.75
  }).addTo(map);

  map.fitBounds(routeLayer.getBounds(), { padding: [60, 60] });

  L.marker(originCoords).addTo(map).bindPopup("Start").openPopup();
  L.marker(destCoords).addTo(map).bindPopup("Destination");

  // Rough straight-line distance
  const distM = map.distance(originCoords, destCoords);
  document.getElementById("routeDistance").textContent =
    (distM / 1000).toFixed(1) + " km (straight line)";
  document.getElementById("routeDuration").textContent = "—";
  document.getElementById("routeInfoBlock").style.display = "flex";
  document.getElementById("stepsBlock").style.display = "none";
}

/*  INIT ON PAGE LOAD  */
document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  if (getSession()) {
    showSite();
  } else {
    showAuth();
  }

  // Allow Enter key to submit login
  document.getElementById("loginPassword")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") login();
  });

  // Allow Enter key to submit signup
  document.getElementById("signupConfirm")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") signup();
  });
});
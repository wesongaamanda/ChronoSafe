/* ========= STORAGE HELPERS ========= */

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

/* ========= PAGE SWITCHING ========= */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId)?.classList.remove("hidden");
}

function switchTo(authPageId) {
  document.querySelectorAll(".auth-page").forEach(p => p.classList.add("hidden"));
  document.getElementById(authPageId)?.classList.remove("hidden");
  clearErrors();
}

function showSite() {
  document.getElementById("authWrapper").classList.add("hidden");
  document.getElementById("mainSite").classList.remove("hidden");
  document.getElementById("mainNav").classList.remove("hidden");
  document.getElementById("mainFooter").classList.remove("hidden");
  document.getElementById("welcomeName").textContent = getSession();
  showPage("homePage");
}

function showAuth() {
  document.getElementById("authWrapper").classList.remove("hidden");
  document.getElementById("mainSite").classList.add("hidden");
  document.getElementById("mainNav").classList.add("hidden");
  document.getElementById("mainFooter").classList.add("hidden");
  switchTo("loginPage");
}

/* ========= ERROR HELPERS ========= */

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

/* ========= AUTH ========= */

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
  showAuth();
}

/* ========= GOOGLE AUTH (SIMULATED) ========= */

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

/* ========= INIT ========= */

document.addEventListener("DOMContentLoaded", () => {
  if (getSession()) {
    showSite();
  } else {
    showAuth();
  }

  // Allow Enter key on login
  document.getElementById("loginPassword")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") login();
  });

  // Allow Enter key on signup
  document.getElementById("signupConfirm")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") signup();
  });
});
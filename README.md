# ChronoSafe 🛡️

> **Predict. Prevent. Protect.**

ChronoSafe is a security-focused web application that helps users identify, prevent, and protect against digital threats — before they happen.

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [JavaScript Functionality](#️-javascript-functionality)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## About

ChronoSafe is a frontend web application built with a dark-themed, modern UI. It provides users with a predictive risk dashboard, real-time system alerts, and a secure authentication flow — all in a clean, minimal interface.

---

## ✨ Features

- **Prediction** — Analyzes data to forecast potential risks
- **Prevention** — Proactively stops problems before they escalate
- **Protection** — Secures systems and user accounts
- **Dashboard** — Live overview of system status, active alerts, and real-time clock
- **Authentication** — Login / sign up with form validation
- **TTC Calculator** — Computes Time-To-Collision from speed and distance inputs
- **Live Weather** — Fetches real-time Nairobi weather (temperature, wind, humidity) via Open-Meteo API
- **Mobile Menu** — Responsive hamburger navigation toggle

---

## 🖥️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Page structure & semantics |
| CSS3 | Styling, layout (Grid & Flexbox), CSS variables |
| JavaScript (Vanilla) | Auth, navigation, dashboard logic, TTC calculator, weather API |
| Open-Meteo API | Live weather data (Nairobi, free & no key required) |

---

## 🚀 Getting Started

No build tools or dependencies required. Just open the project in your browser.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chronosafe.git
cd chronosafe
```

### 2. Open in browser

```bash
# Option A — open directly
open index.html

# Option B — use Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"
```

---

## ⚙️ JavaScript Functionality

All interactivity is handled in `app.js` with no external libraries.

### 🔐 Authentication
- Login is validated against hardcoded credentials (`admin` / `1234`)
- Session is persisted using `localStorage` (`login`, `user` keys)
- Nav buttons update dynamically based on login state (`updateNav()`)
- Logout clears `localStorage` and redirects to the home page

### 🧭 Navigation
- Single-page app (SPA) pattern — sections are shown/hidden via the `.active` CSS class
- `showSection(id)` handles all page transitions and triggers section-specific init functions
- Mobile menu toggled via a hamburger button (`menuToggle`)

### 📊 Dashboard
- Displays the logged-in username from `localStorage`
- Shows a live updating clock via `setInterval` every second
- Loads real-time weather data on mount via `fetchWeather()`

### 🌦️ Weather (Open-Meteo API)
- Fetches live weather for **Nairobi (-1.29°, 36.82°)** from the [Open-Meteo API](https://open-meteo.com/)
- Displays temperature, wind speed, and humidity
- No API key required
- Used on both the Home page and the Dashboard

### ⏱️ TTC Calculator
- Computes **Time-To-Collision** using the formula: `TTC = Distance / Speed`
- Reads speed and distance from input fields and outputs result in seconds
- Input validation included

### 📝 Sign Up Form
- Validates that all fields are filled and passwords match
- Saves username to `localStorage` on successful registration

---

## 📁 Project Structure

```
chronosafe/
├── index.html       # Main HTML — all pages/sections in one file (SPA)
├── style.css        # Global styles, dark theme, CSS variables
├── app.js           # All JavaScript logic
└── README.md        # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">© 2026 ChronoSafe. All rights reserved.</p>

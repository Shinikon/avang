import { initStorage } from "./storage.js";
import { setupRouter } from "./router.js";
import { initNotifications } from "./ui/notifications.js";
import { exportToCSV } from "./ui/exportCSV.js";
import { navigate } from "./utils/helpers.js";
import { initAuth, handleLogout } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  /*   localStorage.removeItem("requests");
  localStorage.removeItem("users");
  localStorage.removeItem("notifications"); */
  await initStorage();

  const isLoggedIn = initAuth();

  if (isLoggedIn) {
    setupRouter();
    initNotifications();
    showLogoutButton();
  }

  window.addEventListener("authchange", () => {
    setupRouter();
    initNotifications();
    showLogoutButton();
  });

  document.addEventListener("click", (e) => {
    if (e.target.id === "home-link") {
      e.preventDefault();
      navigate("/");
    }
    if (e.target.id === "export-btn") {
      exportToCSV();
    }
    if (e.target.id === "logout-btn") {
      if (confirm("Выйти из системы?")) {
        handleLogout();
      }
    }
  });
});

function showLogoutButton() {
  const btn = document.getElementById("logout-btn");
  const statusEl = document.getElementById("user-status");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (btn && statusEl) {
    btn.style.display = "inline-block";
    statusEl.textContent = user.role === "guest" ? "Гость" : "Программист";
  }
}

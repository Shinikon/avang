export function showNotification(text) {
  const container = document.getElementById("notification-container");
  const el = document.createElement("div");
  el.className = "notification";
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

export function navigate(path) {
  window.location.hash = path;
  window.dispatchEvent(new CustomEvent("routechange", { detail: { path } }));
}

export function getCurrentPath() {
  return window.location.hash.slice(1) || "#/";
}

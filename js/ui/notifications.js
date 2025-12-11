import { showNotification } from "../utils/helpers.js";

export function initNotifications() {

  const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
  notifs.slice(-3).forEach((n) => showNotification(n.text));
}

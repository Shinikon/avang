import { showNotification } from "../utils/helpers.js";

export function initNotifications() {
  try {
    const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifs.slice(-3).forEach(n => showNotification(n.text));
  } catch (e) {
    console.warn("Не удалось загрузить уведомления:", e);
  }
}
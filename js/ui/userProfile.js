import { getUsers, getRequests, findUser } from "../storage.js";
import { navigate } from "../utils/helpers.js";

export function showQuickProfile(userId) {
  // Удаление popup
  const existingPopups = document.querySelectorAll(".popup");
  existingPopups.forEach((p) => p.remove());

  const user = findUser(userId);
  const requests = getRequests().filter((r) => r.authorId === userId);
  const active = requests.filter(
    (r) => !["done", "rejected"].includes(r.status)
  ).length;

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-popup">&times;</span>
      <h3>${user.name}</h3>
      <p><strong>Отдел:</strong> ${user.department}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Телефон:</strong> ${user.phone}</p>
      <p><strong>Всего заявок:</strong> ${requests.length}</p>
      <p><strong>Активных:</strong> ${active}</p>
      <button class="btn" style="margin-top:10px;" id="full-profile">Полный профиль</button>
    </div>
  `;
  document.body.appendChild(popup);

  // Функция для закрытия popup
  const closePopup = () => {
    popup.remove();
  };

  popup.querySelector(".close-popup").addEventListener("click", closePopup);

  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });

  popup.querySelector("#full-profile").addEventListener("click", () => {
    closePopup();
    navigate(`/user/${userId}`);
  });

  // QOL Закрытие по клавише Escape
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closePopup();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

export function renderUserProfile(userId) {
  const user = findUser(userId);
  const requests = getRequests();
  const userRequests = requests.filter((r) => r.authorId === userId);
  const devTasks = requests.filter((r) => r.assigneeId === userId);

  const app = document.getElementById("app");
  app.innerHTML = "";

  if (user.role === "developer") {
    const completed = devTasks.filter((r) => r.status === "done").length;
    const total = devTasks.length;
    const avgTime = completed > 0 ? "≈2 дня" : "—";

    const container = document.createElement("div");
    container.className = "dev-profile";
    container.innerHTML = `
      <h2>Профиль: ${user.name}</h2>
      <p><strong>Отдел:</strong> ${user.department}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Телефон:</strong> ${user.phone}</p>
      <h3>Статистика</h3>
      <p>Выполнено: ${completed}</p>
      <p>Среднее время: ${avgTime}</p>
      <p>Текущая загрузка: ${
        devTasks.filter((r) => r.status !== "done" && r.status !== "rejected")
          .length
      } задач</p>
      <div class="chart-container"><canvas id="chart"></canvas></div>
    `;
    app.appendChild(container);

    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Неделя 1", "Неделя 2", "Неделя 3"],
        datasets: [
          {
            label: "Выполнено заявок",
            data: [5, 7, 6],
            backgroundColor: "#3498db",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  } else {
    app.innerHTML = `
      <div class="request-detail">
        <h2>${user.name} (заявитель)</h2>
        <p><strong>Отдел:</strong> ${user.department}</p>
        <p><strong>Заявок:</strong> ${userRequests.length}</p>
        <p><strong>Активных:</strong> ${
          userRequests.filter((r) => !["done", "rejected"].includes(r.status))
            .length
        }</p>
      </div>
    `;
  }
}

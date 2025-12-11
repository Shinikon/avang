import {
  getRequests,
  saveRequests,
  findUser,
  statusLabels,
  priorityLabels,
  formatDate,
  addNotification,
} from "../storage.js";
import { navigate } from "../utils/helpers.js";
import { showQuickProfile } from "./userProfile.js";
import { getCurrentUser } from "../auth.js";

export function renderRequestDetail(id) {
  const requests = getRequests();
  const request = requests.find((r) => r.id === id);
  if (!request) {
    document.getElementById("app").innerHTML = "<h2>Заявка не найдена</h2>";
    return;
  }

  const app = document.getElementById("app");
  app.innerHTML = "";
  const author = findUser(request.authorId);
  const assignee = request.assigneeId ? findUser(request.assigneeId) : null;

  const container = document.createElement("div");
  container.className = "request-detail";
  container.innerHTML = `
    <h2>${request.title}</h2>
    <p><strong>Описание:</strong> ${request.description || "—"}</p>
    <p><strong>Статус:</strong> <span class="status-badge status-${
      request.status
    }">${statusLabels[request.status]}</span></p>
    <p><strong>Приоритет:</strong> <span class="priority-${request.priority}">${
    priorityLabels[request.priority]
  }</span></p>
    <p><strong>Автор:</strong> <a href="#" class="user-popup" data-id="${
      author.id
    }">${author.name}</a> (${author.department})</p>
    <p><strong>Исполнитель:</strong> ${
      assignee ? assignee.name : "Не назначен"
    }</p>
    <p><<strong>Дата создания:</strong> ${formatDate(request.createdAt)}</p>
    <div class="comments" id="comments-section"></div>
  `;
  app.appendChild(container);

  const commentsSection = document.getElementById("comments-section");
  const currentUser = getCurrentUser();

  request.comments.forEach((c) => {
    const cAuthor = findUser(c.authorId);
    const actionMap = {
      accept: "Принято",
      reject: "Отклонено",
      clarify: "Уточнения",
      revise: "Доработка",
    };
    const actionText = c.action ? actionMap[c.action] || "" : "";
    const isRead =
      currentUser && c.readBy.includes(currentUser.id) ? " (прочитано)" : "";
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${cAuthor.name}</span>
        <span class="comment-timestamp">${formatDate(
          c.timestamp
        )}${isRead}</span>
      </div>
      <div>${c.text || "—"}</div>
      ${
        actionText
          ? `<div><em>${actionText}${
              c.reason ? ": " + c.reason : ""
            }</em></div>`
          : ""
      }
      ${c.attachments.length ? `<div>${c.attachments.join(", ")}</div>` : ""}
    `;
    commentsSection.appendChild(el);
  });

  if (currentUser && currentUser.role === "developer") {
    const form = document.createElement("div");
    form.className = "comment-form";
    form.innerHTML = `
      <h3>Добавить комментарий</h3>
      <textarea id="comment-text" placeholder="Текст..."></textarea>
      <div class="comment-actions">
        <select id="comment-action">
          <option value="">Комментарий</option>
          <option value="accept">Принять</option>
          <option value="reject">Отклонить</option>
          <option value="clarify">Уточнения</option>
          <option value="revise">Доработка</option>
        </select>
        <input type="text" id="comment-reason" placeholder="Причина" style="display:none;"/>
        <input type="text" id="comment-attachment" placeholder="Файл (имя)" />
        <button class="btn" id="send-comment">Отправить</button>
      </div>
    `;
    app.appendChild(form);

    const actionSel = document.getElementById("comment-action");
    const reasonInp = document.getElementById("comment-reason");
    actionSel.addEventListener("change", () => {
      reasonInp.style.display = ["reject", "clarify"].includes(actionSel.value)
        ? "block"
        : "none";
    });

    document.getElementById("send-comment").addEventListener("click", () => {
      const text = document.getElementById("comment-text").value.trim();
      const action = actionSel.value;
      const reason = reasonInp.value.trim();
      const attachment = document
        .getElementById("comment-attachment")
        .value.trim();
      const attachments = attachment ? [attachment] : [];

      if (!text && !action) return alert("Введите текст или выберите действие");

      const newComment = {
        id: "c" + Date.now(),
        authorId: currentUser.id,
        text,
        action,
        reason,
        attachments,
        timestamp: new Date().toISOString(),
        readBy: [currentUser.id],
      };

      let newStatus = request.status;
      if (action === "accept") newStatus = "in-progress";
      else if (action === "reject") newStatus = "rejected";
      else if (["clarify", "revise"].includes(action))
        newStatus = "clarification";

      const updated = getRequests().map((r) => {
        if (r.id === id) {
          r.status = newStatus;
          r.comments = [...r.comments, newComment];
          if (r.authorId !== currentUser.id) {
            addNotification(`Новое сообщение в заявке "${r.title}"`);
          }
        }
        return r;
      });

      saveRequests(updated);
      addNotification("Комментарий добавлен");
      renderRequestDetail(id);
    });
  }

  document.querySelectorAll(".user-popup").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showQuickProfile(author.id);
    });
  });
}

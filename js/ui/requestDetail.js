import {
  getRequests,
  saveRequests,
  findUser,
  statusLabels,
  priorityLabels,
  formatDate,
  addNotification,
} from "../storage.js";
import { showQuickProfile } from "./userProfile.js";
import { getCurrentUser } from "../auth.js";

export async function renderRequestDetail(id) {
  const requests = getRequests();
  const request = requests.find((r) => r.id === id);
  if (!request) {
    document.getElementById("app").innerHTML = "<h2>Заявка не найдена</h2>";
    return;
  }

  const res = await fetch("templates/request-detail.html");
  const app = document.getElementById("app");
  app.innerHTML = await res.text();


  document.getElementById("back-btn").onclick = () => {
    window.history.back();
  };

  const author = findUser(request.authorId);
  const assignee = request.assigneeId ? findUser(request.assigneeId) : null;
  const currentUser = getCurrentUser();

  document.getElementById("request-title").textContent = request.title;
  document.getElementById("request-desc").textContent =
    request.description || "—";

  const statusEl = document.getElementById("request-status");
  statusEl.textContent = statusLabels[request.status];
  statusEl.className = `status-badge status-${request.status}`;

  const prioEl = document.getElementById("request-priority");
  prioEl.textContent = priorityLabels[request.priority];
  prioEl.className = `priority-${request.priority}`;

  const authorLink = document.getElementById("author-link");
  authorLink.textContent = author.name;
  authorLink.dataset.id = author.id;

  document.getElementById("author-dept").textContent = author.department;
  document.getElementById("assignee-name").textContent =
    assignee?.name || "Не назначен";
  document.getElementById("request-date").textContent = formatDate(
    request.createdAt
  );


  app.addEventListener("click", (e) => {
    if (e.target.classList.contains("user-popup")) {
      e.preventDefault();
      showQuickProfile(e.target.dataset.id);
    }
  });

  const commentsSection = document.getElementById("comments-section");
  commentsSection.innerHTML = "";
  request.comments.forEach((c) => {
    const commentEl = document.createElement("div");
    commentEl.className = "comment";

    const header = document.createElement("div");
    header.className = "comment-header";

    const authorSpan = document.createElement("span");
    authorSpan.className = "comment-author";
    authorSpan.textContent = findUser(c.authorId).name;
    header.appendChild(authorSpan);

    const timeSpan = document.createElement("span");
    timeSpan.className = "comment-timestamp";
    const isRead =
      currentUser && c.readBy.includes(currentUser.id) ? " (прочитано)" : "";
    timeSpan.textContent = `${formatDate(c.timestamp)}${isRead}`;
    header.appendChild(timeSpan);

    commentEl.appendChild(header);

    const textDiv = document.createElement("div");
    textDiv.textContent = c.text || "—";
    commentEl.appendChild(textDiv);

    if (c.action) {
      const actionMap = {
        accept: "Принято",
        reject: "Отклонено",
        clarify: "Уточнения",
        revise: "Доработка",
      };
      const actionText = actionMap[c.action] || c.action;
      const actionDiv = document.createElement("div");
      actionDiv.innerHTML = `<em>${actionText}${
        c.reason ? ": " + c.reason : ""
      }</em>`;
      commentEl.appendChild(actionDiv);
    }

    if (c.attachments.length) {
      const attDiv = document.createElement("div");
      c.attachments.join(", ");
      commentEl.appendChild(attDiv);
    }

    commentsSection.appendChild(commentEl);
  });

  if (currentUser && currentUser.role === "developer") {
    const formContainer = document.createElement("div");
    formContainer.className = "comment-form";

    const title = document.createElement("h3");
    title.textContent = "Добавить комментарий";
    formContainer.appendChild(title);

    const textarea = document.createElement("textarea");
    textarea.id = "comment-text";
    textarea.placeholder = "Текст...";
    formContainer.appendChild(textarea);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "comment-actions";

    const actionSelect = document.createElement("select");
    actionSelect.id = "comment-action";
    ["Комментарий", "Принять", "Отклонить", "Уточнения", "Доработка"].forEach(
      (label, i) => {
        const value = ["", "accept", "reject", "clarify", "revise"][i];
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        actionSelect.appendChild(opt);
      }
    );
    actionsDiv.appendChild(actionSelect);

    const reasonInput = document.createElement("input");
    reasonInput.type = "text";
    reasonInput.id = "comment-reason";
    reasonInput.placeholder = "Причина";
    reasonInput.style.display = "none";
    actionsDiv.appendChild(reasonInput);

    const attachInput = document.createElement("input");
    attachInput.type = "text";
    attachInput.id = "comment-attachment";
    attachInput.placeholder = "Файл (имя)";
    actionsDiv.appendChild(attachInput);

    const sendBtn = document.createElement("button");
    sendBtn.className = "btn";
    sendBtn.id = "send-comment";
    sendBtn.textContent = "Отправить";
    actionsDiv.appendChild(sendBtn);

    formContainer.appendChild(actionsDiv);
    app.appendChild(formContainer);

    actionSelect.addEventListener("change", () => {
      reasonInput.style.display = ["reject", "clarify"].includes(
        actionSelect.value
      )
        ? "block"
        : "none";
    });

    sendBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      const action = actionSelect.value;
      const reason = reasonInput.value.trim();
      const attachment = attachInput.value.trim();
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

  document.getElementById("back-btn").onclick = () => {
    window.history.back();
  };
}

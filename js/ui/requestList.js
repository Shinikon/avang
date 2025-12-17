import {
  getRequests,
  getUsers,
  findUser,
  statusLabels,
  priorityLabels,
  formatDate,
} from "../storage.js";
import { navigate } from "../utils/helpers.js";
import { showQuickProfile } from "./userProfile.js";

export async function renderRequestList() {
  const response = await fetch("templates/request-list.html");
  const app = document.getElementById("app");
  app.innerHTML = await response.text();

  const requests = getRequests();
  const developers = getUsers().filter((u) => u.role === "developer");

  const fillSelect = (selectId, options) => {
    const select = document.getElementById(selectId);
    options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
  };

  fillSelect("status-filter", Object.entries(statusLabels));
  fillSelect("priority-filter", Object.entries(priorityLabels));

  const assigneeSelect = document.getElementById("assignee-filter");
  developers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    assigneeSelect.appendChild(option);
  });

  app.addEventListener("click", (e) => {
    if (e.target.classList.contains("request-link")) {
      e.preventDefault();
      navigate(`/request/${e.target.dataset.id}`);
    }
    if (e.target.classList.contains("user-popup")) {
      e.preventDefault();
      showQuickProfile(e.target.dataset.id);
    }
  });

  const renderTable = () => {
    const search = document.getElementById("search-input").value.toLowerCase();
    const status = document.getElementById("status-filter").value;
    const priority = document.getElementById("priority-filter").value;
    const assignee = document.getElementById("assignee-filter").value;

    const filtered = requests.filter((r) => {
      const author = findUser(r.authorId);
      const matchesSearch =
        r.title.toLowerCase().includes(search) ||
        (r.description || "").toLowerCase().includes(search) ||
        author.name.toLowerCase().includes(search);
      return (
        matchesSearch &&
        (!status || r.status === status) &&
        (!priority || r.priority === priority) &&
        (!assignee || r.assigneeId === assignee)
      );
    });

    const tbody = document.getElementById("requests-body");
    tbody.innerHTML = "";

    filtered.forEach((r) => {
      const row = document.createElement("tr");

      const author = findUser(r.authorId);
      const assigneeUser = r.assigneeId ? findUser(r.assigneeId) : null;

      const tdId = document.createElement("td");
      tdId.dataset.label = "ID";
      tdId.textContent = r.id;
      row.appendChild(tdId);

      const tdTitle = document.createElement("td");
      tdTitle.dataset.label = "Заголовок";
      const titleLink = document.createElement("a");
      titleLink.href = "#";
      titleLink.className = "link request-link";
      titleLink.dataset.id = r.id;
      titleLink.textContent = r.title;
      tdTitle.appendChild(titleLink);
      row.appendChild(tdTitle);

      const tdStatus = document.createElement("td");
      tdStatus.dataset.label = "Статус";
      const statusBadge = document.createElement("span");
      statusBadge.className = `status-badge status-${r.status}`;
      statusBadge.textContent = statusLabels[r.status];
      tdStatus.appendChild(statusBadge);
      row.appendChild(tdStatus);

      const tdPriority = document.createElement("td");
      tdPriority.dataset.label = "Приоритет";
      const priorityBadge = document.createElement("span");
      priorityBadge.className = `priority-${r.priority}`;
      priorityBadge.textContent = priorityLabels[r.priority];
      tdPriority.appendChild(priorityBadge);
      row.appendChild(tdPriority);

      const tdAuthor = document.createElement("td");
      tdAuthor.dataset.label = "Автор";
      const authorLink = document.createElement("a");
      authorLink.href = "#";
      authorLink.className = "link user-popup";
      authorLink.dataset.id = author.id;
      authorLink.textContent = author.name;
      tdAuthor.appendChild(authorLink);
      row.appendChild(tdAuthor);

      const tdAssignee = document.createElement("td");
      tdAssignee.dataset.label = "Исполнитель";
      tdAssignee.textContent = assigneeUser ? assigneeUser.name : "—";
      row.appendChild(tdAssignee);

      const tdDate = document.createElement("td");
      tdDate.dataset.label = "Дата";
      tdDate.textContent = formatDate(r.createdAt);
      row.appendChild(tdDate);

      tbody.appendChild(row);
    });
  };

  document
    .getElementById("search-input")
    .addEventListener("input", renderTable);
  document
    .getElementById("status-filter")
    .addEventListener("change", renderTable);
  document
    .getElementById("priority-filter")
    .addEventListener("change", renderTable);
  document
    .getElementById("assignee-filter")
    .addEventListener("change", renderTable);

  renderTable();
}

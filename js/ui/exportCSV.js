import { getRequests } from "../storage.js";
import { findUser, statusLabels, priorityLabels } from "../storage.js";
import { formatDate } from "../storage.js";

export function exportToCSV() {
  const requests = getRequests();
  let csvContent = "ID;Заголовок;Описание;Статус;Приоритет;Автор;Исполнитель;Дата создания\n";

  for (const r of requests) {
    const cleanTitle = (r.title || "").replace(/"/g, '""');
    const cleanDesc = (r.description || "").replace(/"/g, '""');
    const author = findUser(r.authorId).name;
    const assignee = r.assigneeId ? findUser(r.assigneeId).name : "—";
    csvContent += `"${r.id}";"${cleanTitle}";"${cleanDesc}";"${statusLabels[r.status]}";"${priorityLabels[r.priority]}";"${author}";"${assignee}";"${formatDate(r.createdAt)}"\n`;
  }

  const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "заявки.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
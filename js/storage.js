export const statusLabels = {
  new: "Новая",
  "in-progress": "В работе",
  done: "Выполнено",
  rejected: "Отклонено",
  clarification: "Требуются уточнения",
};

export const priorityLabels = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  critical: "Критический",
};

export const formatDate = (iso) => new Date(iso).toLocaleString("ru-RU");

const mockUsers = [
  {
    id: "user-1",
    name: "Иван Петров",
    role: "requester",
    department: "Отдел продаж",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
  },
  {
    id: "user-2",
    name: "Мария Сидорова",
    role: "requester",
    department: "Маркетинг",
    email: "maria@example.com",
    phone: "+7 (999) 234-56-78",
  },
  {
    id: "dev-1",
    name: "Алексей Кузнецов",
    role: "developer",
    department: "Разработка",
    email: "alexey@example.com",
    phone: "+7 (999) 345-67-89",
  },
  {
    id: "dev-2",
    name: "Елена Волкова",
    role: "developer",
    department: "Разработка",
    email: "elena@example.com",
    phone: "+7 (999) 456-78-90",
  },
];

const mockRequests = [
  {
    id: "req-1",
    title: "Не работает кнопка сохранения",
    description:
      'После обновления интерфейса кнопка "Сохранить" не реагирует на клик.',
    status: "in-progress",
    priority: "high",
    createdAt: "2025-11-28T10:00:00Z",
    authorId: "user-1",
    assigneeId: "dev-1",
    comments: [
      {
        id: "c1",
        authorId: "dev-1",
        text: "Нужны логи из консоли.",
        action: "clarify",
        reason: "",
        attachments: [],
        timestamp: "2025-11-29T09:15:00Z",
        readBy: ["user-1"],
      },
    ],
  },
  {
    id: "req-2",
    title: "Добавить экспорт в Excel",
    description: "Пользователи просят экспорт отчётов в Excel.",
    status: "new",
    priority: "medium",
    createdAt: "2025-12-01T14:30:00Z",
    authorId: "user-2",
    assigneeId: null,
    comments: [],
  },
];

export function initStorage() {
  if (!localStorage.getItem("requests")) {
    localStorage.setItem("requests", JSON.stringify(mockRequests));
    localStorage.setItem("users", JSON.stringify(mockUsers));
    localStorage.setItem("notifications", JSON.stringify([]));
  }
}

export function getRequests() {
  return JSON.parse(localStorage.getItem("requests") || "[]");
}

export function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function saveRequests(requests) {
  localStorage.setItem("requests", JSON.stringify(requests));
}

export function findUser(id) {
  const users = getUsers();
  return (
    users.find((u) => u.id === id) || {
      name: "Неизвестно",
      department: "—",
      email: "—",
      phone: "—",
    }
  );
}

export function addNotification(text) {
  const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
  notifs.push({
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
    read: false,
  });
  localStorage.setItem("notifications", JSON.stringify(notifs));
  return text;
}

export const statusLabels = {
  new: 'Новая',
  'in-progress': 'В работе',
  done: 'Выполнено',
  rejected: 'Отклонено',
  clarification: 'Требуются уточнения'
};

export const priorityLabels = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический'
};

export const formatDate = (iso) => new Date(iso).toLocaleString('ru-RU');


export async function initStorage() {

  if (localStorage.getItem('requests')) {
    return;
  }

  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json не найден');
    const { requests, users } = await res.json();
    
    localStorage.setItem('requests', JSON.stringify(requests));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('notifications', JSON.stringify([]));
  } catch (err) {
    console.warn('Не удалось загрузить data.json, используем встроенные демо-данные');
    
    
    localStorage.setItem('requests', JSON.stringify(mockRequests));
    localStorage.setItem('users', JSON.stringify(mockUsers));
    localStorage.setItem('notifications', JSON.stringify([]));
  }
}

export function getRequests() {
  return JSON.parse(localStorage.getItem('requests') || '[]');
}

export function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function saveRequests(requests) {
  localStorage.setItem('requests', JSON.stringify(requests));
}

export function findUser(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || { name: 'Неизвестно', department: '—', email: '—', phone: '—' };
}

export function addNotification(text) {
  const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifs.push({ id: Date.now(), text, timestamp: new Date().toISOString(), read: false });
  localStorage.setItem('notifications', JSON.stringify(notifs));
  return text;
}
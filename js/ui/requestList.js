import { getRequests, getUsers, findUser, statusLabels, priorityLabels, formatDate } from '../storage.js';
import { navigate } from '../utils/helpers.js';
import { showQuickProfile } from './userProfile.js';

export function renderRequestList() {
  const requests = getRequests();
  const users = getUsers();
  const developers = users.filter(u => u.role === 'developer');

  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="filters">
      <input type="text" id="search-input" placeholder="Поиск..." />
      <select id="status-filter"><option value="">Все статусы</option>
        <option value="new">Новая</option>
        <option value="in-progress">В работе</option>
        <option value="clarification">Уточнения</option>
        <option value="rejected">Отклонено</option>
        <option value="done">Выполнено</option>
      </select>
      <select id="priority-filter"><option value="">Все приоритеты</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
        <option value="critical">Критический</option>
      </select>
      <select id="assignee-filter"><option value="">Все исполнители</option>
        ${developers.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
      </select>
    </div>
    <table><thead><tr>
      <th>ID</th><th>Заголовок</th><th>Статус</th><th>Приоритет</th>
      <th>Автор</th><th>Исполнитель</th><th>Дата</th>
    </tr></thead><tbody id="requests-body"></tbody></table>
  `;
  app.appendChild(container);

  const render = () => {
    const search = document.getElementById('search-input').value.toLowerCase();
    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;
    const assignee = document.getElementById('assignee-filter').value;

    const tbody = document.getElementById('requests-body');
    tbody.innerHTML = '';

    const filtered = requests.filter(r => {
      const matchesSearch = 
        r.title.toLowerCase().includes(search) ||
        (r.description?.toLowerCase().includes(search)) ||
        findUser(r.authorId).name.toLowerCase().includes(search);
      return matchesSearch &&
             (!status || r.status === status) &&
             (!priority || r.priority === priority) &&
             (!assignee || r.assigneeId === assignee);
    });

    filtered.forEach(r => {
      const row = document.createElement('tr');
      const author = findUser(r.authorId);
      const assigneeUser = r.assigneeId ? findUser(r.assigneeId) : null;
      row.innerHTML = `
        <td data-label="ID">${r.id}</td>
        <td data-label="Заголовок"><a href="#" class="link request-link" data-id="${r.id}">${r.title}</a></td>
        <td data-label="Статус"><span class="status-badge status-${r.status}">${statusLabels[r.status]}</span></td>
        <td data-label="Приоритет"><span class="priority-${r.priority}">${priorityLabels[r.priority]}</span></td>
        <td data-label="Автор"><a href="#" class="link user-popup" data-id="${author.id}">${author.name}</a></td>
        <td data-label="Исполнитель">${assigneeUser ? assigneeUser.name : '—'}</td>
        <td data-label="Дата">${formatDate(r.createdAt)}</td>
      `;
      tbody.appendChild(row);

      row.querySelector('.request-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigate(`/request/${r.id}`);
      });
      row.querySelector('.user-popup')?.addEventListener('click', (e) => {
        e.preventDefault();
        showQuickProfile(r.authorId);
      });
    });
  };

  document.getElementById('search-input').addEventListener('input', render);
  document.getElementById('status-filter').addEventListener('change', render);
  document.getElementById('priority-filter').addEventListener('change', render);
  document.getElementById('assignee-filter').addEventListener('change', render);

  render();
}
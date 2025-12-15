import { renderRequestList } from './ui/requestList.js';
import { renderRequestDetail } from './ui/requestDetail.js';
import { renderUserProfile } from './ui/userProfile.js';
import { getCurrentPath } from './utils/helpers.js';

export function setupRouter() {
  const handleRoute = (path) => {
    if (path === '/' || path === '') {
      renderRequestList();
    } else if (path.startsWith('/request/')) {
      const id = path.split('/')[2];
      renderRequestDetail(id);
    } else if (path.startsWith('/user/') || path.startsWith('/dev/')) {
      const id = path.split('/')[2];
      renderUserProfile(id);
    } else {
      document.getElementById('app').innerHTML = '<h2>404 — Страница не найдена</h2>';
    }
  };

  window.addEventListener('hashchange', () => {
    handleRoute(getCurrentPath());
  });

  handleRoute(getCurrentPath());
}
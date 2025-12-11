import { renderRequestList } from './ui/requestList.js';
import { renderRequestDetail } from './ui/requestDetail.js';
import { renderUserProfile } from './ui/userProfile.js';

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

  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
  });

  window.addEventListener('routechange', (e) => {
    handleRoute(e.detail.path);
  });

  handleRoute(window.location.pathname);
}
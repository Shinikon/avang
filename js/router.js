import { renderRequestList } from "./ui/requestList.js";
import { renderRequestDetail } from "./ui/requestDetail.js";
import { renderUserProfile } from "./ui/userProfile.js";
import { renderProfilePage } from "./ui/profilePage.js";
import { getCurrentPath } from "./utils/helpers.js";

export function setupRouter() {
  const handleRoute = (path) => {
    if (path === "/" || path === "") {
      renderRequestList();
    } else if (path.startsWith("/request/")) {
      const id = path.split("/")[2];
      renderRequestDetail(id);
    } else if (path === "/profile") {
      renderProfilePage();
    } else {
      document.getElementById("app").innerHTML =
        "<h2>404 — Страница не найдена</h2>";
    }
  };

  window.addEventListener("hashchange", () => {
    handleRoute(getCurrentPath());
  });

  handleRoute(getCurrentPath());
}

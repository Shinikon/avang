export function initAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    document.getElementById("app").innerHTML = "";
    return true;
  }
  loadAuthForm();
  return false;
}

async function loadAuthForm() {
  const response = await fetch("templates/auth.html");
  document.body.insertAdjacentHTML("beforeend", await response.text());

  document.getElementById("guest-login").addEventListener("click", () => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: "guest",
        name: "Гость",
        role: "guest",
      })
    );
    document.getElementById("auth-modal").remove();
    window.dispatchEvent(new CustomEvent("authchange"));
  });

  // js/auth.js

  document.getElementById("dev-login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name")?.trim() || "Программист";
    const password = formData.get("password");

    if (password === "123") {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "dev-1",
          name: name,
          role: "developer",
        })
      );

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((user) =>
        user.id === "dev-1" ? { ...user, name: name } : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      document.getElementById("auth-modal").remove();
      window.dispatchEvent(new CustomEvent("authchange"));
    }
  });
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}

export function handleLogout() {
  localStorage.removeItem("currentUser");
  loadAuthForm();
  const btn = document.getElementById("logout-btn");
  const status = document.getElementById("user-status");
  if (btn) btn.style.display = "none";
  if (status) status.textContent = "";
}

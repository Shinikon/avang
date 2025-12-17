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

  document.getElementById("dev-login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name")?.trim() || "Программист",
      password: formData.get("password"),
    };

    if (data.password === "123") {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "dev-1",
          name: data.name,
          role: "developer",
        })
      );
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

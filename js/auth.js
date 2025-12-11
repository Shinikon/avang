export function initAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {

    document.getElementById("app").textContent = "";
    return true;
  }

  showAuthModal();
  return false;
}

function showAuthModal() {
  document.getElementById("app").innerHTML = "";

  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.innerHTML = `
    <div class="auth-content">
      <h2>Вход в систему заявок</h2>
      <p>Выберите способ входа:</p>
      
      <button id="guest-login" class="btn btn-outline">Войти как гость</button>
      
      <div class="divider">или</div>
      
      <form id="dev-login-form">
        <input type="text" id="dev-login" placeholder="Имя (любое)" required />
        <input type="password" id="dev-password" placeholder="Пароль" required />
        <button type="submit" class="btn">Войти как программист</button>
      </form>
      
    </div>
  `;
  document.body.appendChild(modal);


  document.getElementById("guest-login").addEventListener("click", () => {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: "guest",
        name: "Гость",
        role: "guest",
      })
    );
    modal.remove();
    window.dispatchEvent(new CustomEvent("authchange"));
  });


  document.getElementById("dev-login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name =
      document.getElementById("dev-login").value.trim() || "Программист";
    const password = document.getElementById("dev-password").value;

    if (password === "123") {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "dev-1",
          name: name,
          role: "developer",
        })
      );
      modal.remove();
      window.dispatchEvent(new CustomEvent("authchange"));
    } else {
      alert("Неверный пароль");
    }
  });
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}

export function handleLogout() {
  localStorage.removeItem("currentUser");
  showAuthModal(); 
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.style.display = "none";
}

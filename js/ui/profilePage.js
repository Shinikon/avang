export async function renderProfilePage() {
  const res = await fetch("templates/profile.html");
  document.getElementById("app").innerHTML = await res.text();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    document.getElementById("app").innerHTML = "<h2>Требуется вход</h2>";
    return;
  }

  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-role").textContent =
    user.role === "guest" ? "Гость" : "Программист";
  document.getElementById("profile-id").textContent = user.id;
}

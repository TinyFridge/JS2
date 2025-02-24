import { authGuard } from "../../utilities/authGuard";

authGuard();

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmailEl = document.getElementById("user-email");

  if (user && user.email) {
    userEmailEl.textContent = "Email: " + user.email;
  } else {
    userEmailEl.textContent = "User data not found.";
  }

  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.html";
  });
});

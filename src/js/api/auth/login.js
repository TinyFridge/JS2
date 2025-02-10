document.addEventListener("DOMContentLoaded",  () => {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");
    const loginLink = document.getElementById("login-link");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user && window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
        window.location.href = "/auth/login/";
    }

    if (user) {
        loginSection.style.display = "none";
        logoutBtn.classList.remove("hidden");
        loginLink.classList.add("hidden");
    )


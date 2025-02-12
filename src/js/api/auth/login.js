document.addEventListener("DOMContentLoaded",  () => {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const loginError = document.getElementById("login-error");
    const loginLink = document.getElementById("login-link");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user && window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
        window.location.href = "/auth/login/";
    }

    if (user) {
        loginSection.style.display = "none";
        logoutBtn.classList.remove("hidden");
        loginLink.classList.add("hidden");
    }


    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password"),value;

        if (email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no")) {
            localStorage.setItem("user". JSON.stringify({email}));
            window.location.href = "/profile/";
        } else {
            loginError.classList.remove("hidden");
        }
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        location.reload();
   
    });
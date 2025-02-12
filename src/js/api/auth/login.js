document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const user = JSON.parse(localStorage.getItem("user"));

    const allowedPages = ["/", "/index.html", "/register.html"];

    console.log("Current path:", window.location.pathname);
    console.log("User found:", user);

    if (!user && !allowedPages.includes(window.location.pathname)) {
    console.log("Redirecting to index.html...");
    window.location.href = "/index.html";
    }


    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no")) {
                localStorage.setItem("user", JSON.stringify({ email }));
                window.location.href = "/profile.html";
            } else {
                loginError.classList.remove("hidden");
            }
        });
    }
});

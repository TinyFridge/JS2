document.addEventListener("DOMContentLoaded",  () => {
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const user = JSON.parse(localStorage.getItem("user"));

    const isAuthPage = window.location.pathname === "/" || 
                       window.location.pathname.endsWith("index.html") || 
                       window.location.pathname.endsWith("register.html");

    if (!user && !isIndexPage)  {
        window.location.href = "/index.html"
    }

    }

    if (loginForm)  {    
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
            });
        }
    );
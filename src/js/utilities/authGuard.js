export function authGuard() {
  const publicPages = ["/", "/Index.html", "/register.html"];

  if (publicPages.includes(window.location.pathname)) {
    return;
  }

  if(!localStorage.token) {
    alert("You must be logged in to view this page");
    window.location.href = "/index.html";
  }
}
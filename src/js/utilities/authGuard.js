export function authGuard() {
  const publicPages = ["/", "/index.html", "/register.html"];
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("🔍 Checking authentication:", user);

  if (publicPages.includes(window.location.pathname)) {
    console.log("🆓 Public page, skipping auth check.");
    return;
  }

  if (!user || !user.accessToken) {
    console.warn("⚠ User not authenticated. Redirecting...");
    alert("You must be logged in to view this page");
    window.location.href = "/index.html";
  } else {
    console.log("✅ User authenticated:", user);
  }
}

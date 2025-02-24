import { API_AUTH_LOGIN, API_AUTH_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  const allowedPages = ["/", "/index.html", "/register.html"];
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("Current path:", window.location.pathname);
  console.log("User found:", user);

  if (!user && !allowedPages.includes(window.location.pathname)) {
    console.log("Redirecting to index.html...");
    window.location.href = "/index.html";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!(email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no"))) {
        loginError.textContent = "Email must be a valid Noroff email";
        loginError.classList.remove("hidden");
        return;
      }

      try {
        const response = await fetch(API_AUTH_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed");
        }

        const loginData = await response.json();
        console.log("Login successful", loginData);
        const accessToken = loginData.data.accessToken;

        if (!accessToken) {
          throw new Error("Access token not returned");
        }

        localStorage.setItem("user", JSON.stringify({ email, accessToken }));

        const keyResponse = await fetch(API_AUTH_KEY, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ name: "My API Key" })
        });

        if (!keyResponse.ok) {
          const keyErrorData = await keyResponse.json();
          throw new Error(keyErrorData.error || "Failed to create API key");
        }

        const keyData = await keyResponse.json();
        const apiKey = keyData.data.key;
        if (!apiKey) {
          throw new Error("API key not returned");
        }

        localStorage.setItem("apiKey", apiKey);

        window.location.href = "/profile/profile.html";
      } catch (error) {
        console.error(error);
        loginError.textContent = "Login failed: " + error.message;
        loginError.classList.remove("hidden");
      }
    });
  }
});

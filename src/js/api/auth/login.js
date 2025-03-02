import { API_AUTH_LOGIN, API_AUTH_KEY } from "../constants.js";

// Only run authGuard on pages that are not public.
// (If your login page is public, you can skip the auth guard check here.)
if (!["/", "/index.html"].includes(window.location.pathname.toLowerCase())) {
  // If the page is not public, enforce authentication.
  // (Adjust your authGuard logic as needed for mobile.)
  import("../../utilities/authGuard").then(module => {
    module.authGuard();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 login.js loaded on mobile");

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (!loginForm) {
    console.error("❌ Login form not found.");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("🟡 Login form submitted");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Email:", email, "Password:", password);

    if (!email || !password) {
      console.warn("⚠ Missing email or password.");
      return;
    }

    try {
      console.log("About to send POST request to", API_AUTH_LOGIN);
      const response = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        mode: "cors", // explicitly use CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Fetch response received with status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API error data:", errorData);
        throw new Error(errorData.errors ? errorData.errors[0].message : "Login failed");
      }

      const loginData = await response.json();
      console.log("✅ Login data received:", loginData);

      const accessToken = loginData.data?.accessToken;
      if (!accessToken) {
        throw new Error("Access token not returned.");
      }

      // Build the user object
      const user = {
        email: loginData.data.email,
        name: loginData.data.name,
        accessToken,
        avatar: loginData.data.avatar ? loginData.data.avatar.url : null,
        banner: loginData.data.banner ? loginData.data.banner.url : null,
      };

      console.log("Storing user in localStorage:", user);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Requesting API key from", API_AUTH_KEY);
      const keyResponse = await fetch(API_AUTH_KEY, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: "My API Key" }),
      });
      console.log("API key response status:", keyResponse.status);
      if (!keyResponse.ok) {
        const keyError = await keyResponse.json();
        console.error("❌ API key error:", keyError);
        throw new Error(keyError.errors ? keyError.errors[0].message : "Failed to get API key");
      }
      const keyData = await keyResponse.json();
      const apiKey = keyData.data?.key;
      if (!apiKey) {
        throw new Error("No API key returned.");
      }
      console.log("Storing API key:", apiKey);
      localStorage.setItem("apiKey", apiKey);

      // Redirect to profile page.
      window.location.href = "/profile/profile.html";
    } catch (error) {
      console.error("Login error:", error);
      if (loginError) {
        loginError.textContent = `Login failed: ${error.message}`;
        loginError.classList.remove("hidden");
      }
    }
  });
});

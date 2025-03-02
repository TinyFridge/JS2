console.log("Login.js loaded");

import { API_AUTH_LOGIN, API_AUTH_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 login.js loaded successfully!");

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (!loginForm) {
    console.error("❌ Login form not found in the DOM.");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("🟡 Login form submitted!");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      console.warn("⚠ Missing email or password.");
      return;
    }

    try {
      console.log("Sending login request to:", API_AUTH_LOGIN);
      const response = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors ? errorData.errors[0].message : "Login failed"
        );
      }

      const loginData = await response.json();
      console.log("Login successful, data:", loginData);

      const accessToken = loginData.data?.accessToken;
      if (!accessToken) {
        throw new Error("Access token not returned.");
      }

      // Construct the user object from the API response.
      const user = {
        email: loginData.data.email,
        name: loginData.data.name,
        accessToken,
        avatar: loginData.data.avatar ? loginData.data.avatar.url : null,
        banner: loginData.data.banner ? loginData.data.banner.url : null,
      };

      console.log("Storing user:", user);
      localStorage.setItem("user", JSON.stringify(user));

      // Create an API key for the session.
      const keyResponse = await fetch(API_AUTH_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: "My API Key" }),
      });

      if (!keyResponse.ok) {
        const keyErrorData = await keyResponse.json();
        throw new Error(
          keyErrorData.errors
            ? keyErrorData.errors[0].message
            : "Failed to create API key"
        );
      }

      const keyData = await keyResponse.json();
      const apiKey = keyData.data?.key;
      if (!apiKey) {
        throw new Error("API key not returned.");
      }

      console.log("Storing API key:", apiKey);
      localStorage.setItem("apiKey", apiKey);

      // Redirect to the profile page.
      window.location.href = "/profile/profile.html";
    } catch (error) {
      console.error("❌ Login error:", error);
      loginError.textContent = `Login failed: ${error.message}`;
      loginError.classList.remove("hidden");
    }
  });
});

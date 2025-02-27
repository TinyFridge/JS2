import { API_AUTH_LOGIN, API_KEY } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 login.js loaded successfully!");

  const loginForm = document.getElementById("login-form");
  if (!loginForm) {
    console.error("❌ Login form not found in the DOM.");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("🟡 Login form submitted!");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!(email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no"))) {
      document.getElementById("login-error").textContent = "Email must be a valid Noroff email";
      document.getElementById("login-error").classList.remove("hidden");
      return;
    }

    console.log("📤 Sending API request to:", API_AUTH_LOGIN);
    console.log("👤 Login Data:", { email, password });

    try {
      const response = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("🔍 API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error Response:", errorData);
        throw new Error(errorData.errors ? errorData.errors[0].message : "Login failed");
      }

      const data = await response.json();
      console.log("📩 API Response Data:", data);

      const accessToken = data.data?.accessToken;
      console.log("🔑 Access Token Received:", accessToken);

      if (!accessToken) {
        throw new Error("Access token not returned.");
      }

      localStorage.setItem("user", JSON.stringify({
        email: data.data.email,
        name: data.data.name,
        accessToken,
        avatar: data.data.avatar?.url || null,
        banner: data.data.banner?.url || null,
      }));

      localStorage.setItem("apiKey", API_KEY);
      console.log("✅ User stored in localStorage:", localStorage.getItem("user"));
      console.log("✅ API Key stored in localStorage:", localStorage.getItem("apiKey"));

      window.location.href = "/profile/profile.html";
    } catch (error) {
      console.error("❌ Login error:", error);
      document.getElementById("login-error").textContent = "Login failed: " + error.message;
      document.getElementById("login-error").classList.remove("hidden");
    }
  });
});

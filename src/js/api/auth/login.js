document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 login.js loaded successfully!");
    console.log("🔵 Login form detected, adding event listener...");

    const loginForm = document.getElementById("login-form");
    if (!loginForm) {
        console.error("❌ Login form not found in the DOM.");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("🟡 Login form submitted!");
        console.log("🔵 Login form submitted...");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            console.warn("⚠ Missing email or password.");
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

            console.log("✅ User stored in localStorage:", localStorage.getItem("user"));

            window.location.href = "/profile.html";
        } catch (error) {
            console.error("❌ Login error:", error);
        }
    });
});

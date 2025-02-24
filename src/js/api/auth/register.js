import { API_AUTH_REGISTER } from "../constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms.register;
  if (form) {
    form.addEventListener("submit", onRegister);
    console.log("Event listener attached to register form");
  } else {
    console.error("Register form not found");
  }
});

export async function onRegister(event) {
  event.preventDefault();
  console.log("Register function triggered");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorElement = document.getElementById("register-error");

  console.log("Name:", name, "Email:", email, "Password:", password, "Confirm:", confirmPassword);

  errorElement.classList.add("hidden");
  errorElement.textContent = "";

  const nameRegex = /^[A-Za-z0-9_]+$/;
  if (!nameRegex.test(name)) {
    errorElement.textContent = "Name must only contain letters, numbers, or underscores";
    errorElement.classList.remove("hidden");
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    errorElement.textContent = "Email must be a valid stud.noroff.no email";
    errorElement.classList.remove("hidden");
    return;
  }

  if (password.length < 8) {
    errorElement.textContent = "Password must be at least 8 characters long";
    errorElement.classList.remove("hidden");
    return;
  }
  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match";
    errorElement.classList.remove("hidden");
    return;
  }

  const payload = {
    name: name,
    email: email,
    password: password
  };

  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error details:", errorData.errors);
      if (errorData.errors && errorData.errors[0].message === "Profile already exists") {
        errorElement.textContent = "A profile with this email already exists. Please use a different email.";
      } else {
        errorElement.textContent = "Registration failed: " + (errorData.error || "Unknown error");
      }
      errorElement.classList.remove("hidden");
      return;
    }

    const data = await response.json();
    console.log("Registration successful", data);

    window.location.href = "/index.html";
  } catch (error) {
    console.error(error);
    errorElement.textContent = "Registration failed: " + error.message;
    errorElement.classList.remove("hidden");
  }
}

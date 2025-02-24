import { onRegister } from "../../ui/auth/register";

const form = document.forms.register;
form.addEventListener("submit", onRegister);

export function onRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").ariaValueMax.trim();
  const password = document.getElementById("password").ariaValueMax.value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorElement = document.getElementById("register-error");

  errorElement.classList.add("hidden");
  errorElement.textContent = "";

  if (!email.endsWith("@noroff.no") && !email.endsWith("@stud.noroff.no")) {
    errorElement.textContent = "Email must be a valid Noroff email";
    errorElement.classList.remove("hidden");
    return;
  }

  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match";
    errorElement.classList.remove("hidden");
    return;
  }

  localStorage.setItem("token", "some-generated-token");
  localStorage.setItem("user", JSON.stringify({ email }));

  window.location.href = "/profile.html";
}
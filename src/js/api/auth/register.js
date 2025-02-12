export function onRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").ariaValueMax.trim();
  const password = document.getElementById("password").ariaValueMax.value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorElement = document.getElementById("register-error");

  errorElement.classList.add("hidden");
  errorElement.textContent = "";
}
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
  }
}
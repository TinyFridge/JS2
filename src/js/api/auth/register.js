document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms.register;
  if (form) {
    form.addEventListener("submit", onRegister);
    console.log("Event listener attached to register form");
  } else {
    console.error("Register form not found");
  }
});

export function onRegister(event) {
  event.preventDefault();
  console.log("Register function triggered");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorElement = document.getElementById("register-error");

  console.log("Email:", email, "Password:", password, "Confirm:", confirmPassword);

  errorElement.classList.add("hidden");
  errorElement.textContent = "";

  if (!email.endsWith("@noroff.no") && !email.endsWith("@stud.noroff.no")) {
    console.log("Invalid email domain");
    errorElement.textContent = "Email must be a valid Noroff email";
    errorElement.classList.remove("hidden");
    return;
  }

  if (password !== confirmPassword) {
    console.log("Passwords do not match");
    errorElement.textContent = "Passwords do not match";
    errorElement.classList.remove("hidden");
    return;
  }

  console.log("Registration successful, redirecting...");

  localStorage.setItem("token", "some-generated-token");
  localStorage.setItem("user", JSON.stringify({ email }));

  window.location.href = "/profile.html";
}

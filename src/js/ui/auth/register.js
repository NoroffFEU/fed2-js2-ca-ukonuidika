import { register } from "../../api/auth/register";

export async function onRegister(event) {
  event.preventDefault();

  const registerForm = event.target;

  const name = registerForm.querySelector("#userName").value;
  const email = registerForm.querySelector("#email").value;
  const password = registerForm.querySelector("#password").value;
  const bio = registerForm.querySelector("#bio").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = registerForm.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  try {
    const response = await register({
      name,
      email,
      password,
      bio,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Registration successful:", result);
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/auth/login/";
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Registration failed: ${error.message}`;
    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon =
  togglePasswordButton.getElementsByClassName("toggle-password");

let isPasswordVisible = false;

togglePasswordButton.addEventListener("click", function () {
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});

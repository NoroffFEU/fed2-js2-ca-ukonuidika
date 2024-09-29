import { login } from "../../api/auth/login";

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

export async function onLogin(event) {
  event.preventDefault();

  const loginForm = event.target;

  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = loginForm.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  try {
    const response = await login({ email, password });

    if (response.ok) {
      const result = await response.json();
      console.log("Login successful:", result);
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("token", result.data.accessToken);
      window.location.href = "/";
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Login failed: ${error.message}`;
    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const LoginForm = document.querySelector("#loginForm");
  LoginForm.addEventListener("submit", onLogin);
});

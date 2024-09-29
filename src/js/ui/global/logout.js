import { onLogout } from "../auth/logout";

export function setLogoutListener() {
  const logoutButton1 = document.querySelector("#logout");
  const logoutButton2 = document.querySelector("#mobileLogout");

  logoutButton1.addEventListener("click", function (event) {
    event.preventDefault();
    onLogout();
  });

  logoutButton2.addEventListener("click", function (event) {
    event.preventDefault();
    onLogout();
  });
}
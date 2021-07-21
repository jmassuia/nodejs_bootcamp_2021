import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";

//DOM Elements
const mapBox = document.getElementById("map");
const form = document.querySelector(".form");
const logoutBtn = document.querySelector("button.nav__el--logout");

//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.querySelector("input#password").value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    logout();
    window.setTimeout(() => {
      location.assign("/");
    }, 1500);
  });
}

import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";

//DOM Elements
const mapBox = document.getElementById("map");
const form = document.querySelector("form.form--login");
const logoutBtn = document.querySelector("button.nav__el--logout");
const userSettingsForm = document.querySelector("form.form-user-data");
const userPasswordForm = document.querySelector("form.form-user-settings");

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

if (userSettingsForm) {
  userSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const data = { name, email };

    console.log(name, email);
    updateSettings(data, "settings");

    window.setTimeout(() => {
      location.assign("/");
    }, 1500);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    const data = { passwordCurrent, password, passwordConfirm };
    await updateSettings(data, "password");

    //Cleanup input fews after processment.
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

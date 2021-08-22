import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

//DOM Elements
const mapBox = document.getElementById("map");
const form = document.querySelector("form.form--login");
const logoutBtn = document.querySelector("button.nav__el--logout");
const bookingBtn = document.getElementById("booking-btn");
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

if (bookingBtn) {
  bookingBtn.addEventListener("click", (e) => {
    e.preventDefault;
    const { tourId } = e.target.dataset;
    bookingBtn.textContent = "Processing...";
    bookTour(tourId);
    setTimeout(() => {
      bookingBtn.textContent = "Book a tour";
    }, 1000);
  });
}

if (userSettingsForm) {
  userSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formSettings = new FormData();
    formSettings.append("name", document.getElementById("name").value);
    formSettings.append("email", document.getElementById("email").value);
    formSettings.append("photo", document.getElementById("photo").files[0]);

    updateSettings(formSettings, "data");

    // window.setTimeout(() => {
    //   location.assign("/");
    // }, 1500);
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

import axios from "axios";

import { showAlert } from "./alert";

export const login = async (email, password) => {
  // Get element values
  // const email = document.getElementById("email").value;
  // const password = document.querySelector("input#password").value;

  try {
    const result = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (result.status === 200) {
      showAlert("success", "Logged successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    await axios.get("/api/v1/users/logout");
  } catch (err) {
    showAlert("error", err);
  }
};

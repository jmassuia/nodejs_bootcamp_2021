import axios from "axios";

import { showAlert } from "./alert";

export const updateSettings = async (data, type) => {
  try {
    const url = type === "password" ? "updateMyPassword" : "updateMe";

    const updateUserSettings = await axios.patch(
      `http://localhost:8888/api/v1/users/${url}`,
      data
    );

    if (updateUserSettings.status === 200) {
      return showAlert("success", "User data updated successfully!!");
    }
  } catch (err) {
    console.log(err);
    return showAlert("error", err);
  }
};

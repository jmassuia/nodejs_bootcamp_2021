const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8888/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get element values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email);
  console.log(password);
  login(email, password);
});

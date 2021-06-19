const userRouter = require("express").Router();
// const {} = require('../controllers/userController');
const {
  getAllUsers,
  updateMyData,
  deleteMe,
  getUser,
} = require("../controllers/userController");
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");

//USER CRUD

//GETs requests
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
//POSTs requests
userRouter.post("/signup", signup);
userRouter.post("/login", login);
//PATCHs requests
userRouter.patch("/updateMyData", protect, updateMyData);
userRouter.patch("/updateMyPassword", protect, updatePassword);
//DELETE requests
userRouter.delete("/deleteMe", protect, deleteMe);

//Authentication routes
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

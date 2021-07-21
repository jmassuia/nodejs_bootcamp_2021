const userRouter = require("express").Router();
// const {} = require('../controllers/userController');
const {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
  deleteMe,
  deleteUser,
} = require("../controllers/userController");
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require("../controllers/authController");

//USER CRUD

//POSTs requests
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
//Authentication routes
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

//Using the use router as an middleware function, which will protects all the subsequential routes
userRouter.use(protect);

//GETs requests
userRouter.get("/", getAllUsers);
userRouter.get("/me", getMe, getUser);
userRouter.get("/:id", restrictTo("admin", "lead-guide"), getUser);

//PATCHs requests
userRouter.patch("/updateMe", updateMe);
userRouter.patch(
  "/updateUser/:id",
  restrictTo("admin", "lead-guide"),
  updateUser
);
userRouter.patch("/updateMyPassword", updatePassword);

//DELETE requests
userRouter.delete("/deleteMe", deleteMe);
userRouter.delete("/deleteUser/:id", restrictTo("admin"), deleteUser);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

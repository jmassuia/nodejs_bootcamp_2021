const userRouter = require('express').Router();
// const {} = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const { signup, login } = require('../controllers/authController');

userRouter.get('/', getAllUsers);

userRouter.post('/signup', signup);
userRouter.post('/login', login);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

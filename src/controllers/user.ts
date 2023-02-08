import User from '../models/user';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import createSendToken from '../utils/createSendToken';

// Register
export const register = catchAsync(async (req, res, next) => {
  // Check username and email if the user already exists
  const existingUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (existingUser?.email === req.body.email) {
    return next(new AppError('Email already in use.', 400));
  }
  if (existingUser?.username === req.body.username) {
    return next(new AppError('Username already in use.', 400));
  }

  const user = await User.create({
    username: req.body.username,
    displayName: req.body.displayName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});

// Login
export const login = catchAsync(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;
  // Check email and password are in body
  if (!usernameOrEmail || !password) {
    return next(
      new AppError('Please provide username or email and password.', 400)
    );
  }

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select('+password');
  // Check if the user exists in DB and the password is correct
  // correctPassword does not run if the user does not exist
  if (!user || !(await user.correctPassword(password, user.password!))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

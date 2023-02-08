import User from '../models/user';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import createSendToken from '../utils/createSendToken';

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

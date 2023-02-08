import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import createSendToken from '../utils/createSendToken';

// Protect
export const protect = catchAsync(async (req, res, next) => {
  let token: string | undefined;
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  const currentUser = await User.findById(decoded.id);

  // If the user deleted their account after logging in
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // if (currentUser.changedPasswordAfter(decoded.iat!)) {
  //   return next(
  //     new AppError(
  //       'User recently changed password! Please log in again.',
  //       401
  //     )
  //   );
  // }

  req.user = currentUser;
  next();
});

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

// Logout
export const logout = (req: Request, res: Response) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out',
  });
};

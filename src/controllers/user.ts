import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import createSendToken from '../utils/createSendToken';

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return next(new AppError('No user find with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const currentUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

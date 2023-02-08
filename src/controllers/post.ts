import { NextFunction, Request, Response } from 'express';
import Post from '../models/post';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import { UserRequest } from '../utils/types';

// middleware
export const setUserId = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.postedBy) {
    req.body.postedBy = req.user?.id;
  }
  next();
};

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.create(req.body);
    /* Use for normal post */
    await post.populate('postedBy');

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    });
  }
);

export const getAllPosts = catchAsync(async (req, res, next) => {
  let filter = {};

  const features = new APIFeatures(
    Post.find(filter).populate({ path: 'postedBy' }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .pagenate();

  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

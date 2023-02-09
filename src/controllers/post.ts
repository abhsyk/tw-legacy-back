import { NextFunction, Request, Response } from 'express';
import Post from '../models/post';
import User from '../models/user';
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
  if (req.params?.userId) {
    /* Loading specific user's posts */
    filter = { postedBy: req.params?.userId };
  }

  const features = new APIFeatures(
    Post.find(filter).populate([
      'postedBy',
      { path: 'repostData', populate: 'postedBy' },
      { path: 'repostUsers' },
    ]),
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

export const repost = catchAsync(async (req: UserRequest, res, next) => {
  const postId = req.body.postId;
  const userId = req.user?.id;

  // Try and delete repost
  const deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    repostData: postId,
  });

  let repost = deletedPost;
  if (deletedPost === null) {
    repost = await Post.create({
      postedBy: userId,
      repostData: postId,
    });
  }

  const option = deletedPost !== null ? '$pull' : '$addToSet';

  await User.findByIdAndUpdate(
    userId,
    { [option]: { reposts: repost?._id } },
    { new: true }
  );

  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { repostUsers: userId } },
    { new: true }
  );
  await post?.populate('postedBy');

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

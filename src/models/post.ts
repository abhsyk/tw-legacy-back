import mongoose, { Schema } from 'mongoose';
import { IPost } from '../utils/types';

const postSchema = new mongoose.Schema<IPost>(
  {
    content: { type: String, trim: true },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Content must belong to a user.'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    repostUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostData: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;

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
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;

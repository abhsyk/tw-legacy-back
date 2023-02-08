import { Request } from 'express';
import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  displayName: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
  bio: string;
  website: string;
  location: string;
  profileIcon: string;
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
}

export interface IPost extends Document {
  content: string;
  postedBy: Schema.Types.ObjectId;
}

export interface UserRequest extends Request {
  user?: IUser;
}

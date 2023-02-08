import { Document } from 'mongoose';

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

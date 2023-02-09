import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser } from '../utils/types';

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 14,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required.'],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, ''],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm a password.'],
      validate: {
        validator: function (this: IUser, passConfirm: string): boolean {
          return passConfirm === this.password;
        },
        message: 'Passwords are not the same.',
      },
    },
    profileIcon: {
      type: String,
      default: (): string => {
        const colors = ['red', 'gray', 'blue', 'green'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `/images/default-icon-${color}.png`;
      },
    },
    bio: String,
    website: String,
    location: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

// Hash the password before saving
userSchema.pre<IUser>('save', async function (next) {
  // If password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password
  this.password = await bcrypt.hash(this.password!, 12);
  // Delete confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.method<IUser>(
  'correctPassword',
  async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
);

const User = mongoose.model('User', userSchema);
export default User;

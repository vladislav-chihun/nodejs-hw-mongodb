import { string } from 'joi';
import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: string,
      required: true,
    },
    email: {
      type: string,
      email: true,
      unique: true,
      required: true,
    },
    password: {
      type: string,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model('User', usersSchema);
export { usersSchema };

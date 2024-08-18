import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      email: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const UsersCollection = mongoose.model('User', usersSchema);

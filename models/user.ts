import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String },
    username: { type: String },
    password: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = models.User || model<IUser>('User', userSchema);
export default User;

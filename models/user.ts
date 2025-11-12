import { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  sub: string;
  email: string;
  username: string;
  password: string;
  role: string;
  email_verified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String },
    sub: { type: String },
    email: { type: String },
    username: { type: String },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    email_verified: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = models.User || model<IUser>('User', userSchema);
export default User;

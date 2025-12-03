import { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  sub: string;
  email: string;
  username: string;
  password: string;
  role: string;
  isOnboard: boolean;
  email_verified: boolean;

  goal?: string;
  image?: string;
  company?: string;
  country?: string;
  phoneNumber?: string;
  given_name: string;
  family_name: string;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String },
    sub: { type: String },
    email: { type: String },
    username: { type: String },
    isOnboard: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    email_verified: { type: Boolean, default: false },

    goal: { type: String }, // for analytics
    image: { type: String, default: null },
    company: { type: String, default: null },
    country: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    given_name: { type: String },
    family_name: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = models.User || model<IUser>('User', userSchema);
export default User;

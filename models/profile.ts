import { Schema, models, model, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: Schema.Types.ObjectId;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  kbaQuestion: string;
  kbaAnswer: string;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    sub: { type: String },
    email: { type: String },
    email_verified: { type: Boolean, default: false },
    name: { type: String },
    picture: { type: String },
    given_name: { type: String },
    family_name: { type: String },
    kbaQuestion: { type: String },
    kbaAnswer: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Profile = models.Profile || model<IProfile>('Profile', profileSchema);
export default Profile;

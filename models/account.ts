import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IAccount extends Document {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
  id_token: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const accountSchema = new Schema<IAccount>(
  {
    provider: { type: String },
    type: { type: String },
    providerAccountId: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    scope: { type: String },
    token_type: { type: String },
    id_token: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Account = models.Account || model<IAccount>('Account', accountSchema);
export default Account;

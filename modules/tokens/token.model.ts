import { Schema, models, model } from 'mongoose';
export interface IIps {
  address: string;
}
export interface IToken extends Document {
  emailToChange?: string;
  token: string;
  code: string;
  type: string;
  expires: Date;
  expiresCode: Date;
  email: string;
}

const tokenSchema = new Schema<IToken>(
  {
    email: { type: String },
    emailToChange: { type: String },
    token: { type: String },
    code: { type: String },
    type: { type: String, enum: ['EmailVerification', 'ChangeEmailVerification'] },
    expires: { type: Date },
    expiresCode: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

const Token = models.Token || model<IToken>('Token', tokenSchema);
export default Token;

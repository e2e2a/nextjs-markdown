import { Schema, model, models, Document, Types } from 'mongoose';

export interface IRateLimit extends Document {
  userId?: Types.ObjectId;
  email: string;
  ip: string;
  deviceType: string;
  browser?: string;
  os?: string;
  userAgent?: string;

  // rate limit fields:
  type: 'login' | 'register' | 'sendEmail' | 'verify';
  retryCount: number;
  retryResetAt: Date;
}

const rateLimitSchema = new Schema<IRateLimit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    ip: { type: String },
    deviceType: { type: String },
    browser: { type: String },
    os: { type: String },
    userAgent: { type: String },

    // rate limit fields:
    type: { type: String, enum: ['login', 'register', 'sendEmail', 'verify'] },
    retryCount: { type: Number },
    retryResetAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RateLimit = models.RateLimit || model<IRateLimit>('RateLimit', rateLimitSchema);

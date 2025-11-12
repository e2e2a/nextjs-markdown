import { Schema, model, models, Document, Types } from 'mongoose';

export interface IAccessRecord extends Document {
  userId: Types.ObjectId;
  ip: string;
  deviceType: string;
  browser?: string;
  os?: string;
  userAgent?: string;
  lastLogin: Date;
}

const accessRecordSchema = new Schema<IAccessRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String },
    deviceType: { type: String },
    browser: { type: String },
    os: { type: String },
    userAgent: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AccessRecord =
  models.AccessRecord || model<IAccessRecord>('AccessRecord', accessRecordSchema);

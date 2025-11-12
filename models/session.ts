import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface ISession extends Document {
  sessionToken: string;
  userId: mongoose.Schema.Types.ObjectId;
  expires: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionToken: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    expires: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Session = models.Session || model<ISession>('Session', sessionSchema);
export default Session;

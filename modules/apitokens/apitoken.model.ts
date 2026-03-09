import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IApiToken extends Document {
  tokenHash: string;
  userId: mongoose.Schema.Types.ObjectId;
  // name: string;
  revoked: boolean;
  expiresAt?: Date;
  lastUsed?: Date;
}

const ApiTokenSchema = new Schema<IApiToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // name: {
    //   type: String,
    //   required: true,
    // },

    revoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
    },

    lastUsed: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ApiToken = models.ApiToken || model<IApiToken>('ApiToken', ApiTokenSchema);

export default ApiToken;

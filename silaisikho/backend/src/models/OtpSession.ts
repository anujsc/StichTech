import mongoose from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IOtpSessionDocument extends mongoose.Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface IOtpSessionModel extends mongoose.Model<IOtpSessionDocument> {
  findActiveOtp(email: string): Promise<IOtpSessionDocument | null>;
  createOtpSession(email: string, otpHash: string): Promise<IOtpSessionDocument>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const OtpSessionSchema = new mongoose.Schema<IOtpSessionDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: [true, 'OTP hash is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry time is required'],
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// 1. TTL index — MongoDB deletes the document at the moment expiresAt is reached
OtpSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'otpSession_ttl_index' }
);

// 2. Compound — covers findActiveOtp filter (email + isUsed + expiresAt range)
//    email first: most selective; isUsed second; expiresAt third for range filter
OtpSessionSchema.index({ email: 1, isUsed: 1, expiresAt: 1 });

// 3. Standalone createdAt desc — covers sort in findActiveOtp
OtpSessionSchema.index({ createdAt: -1 });

// ─── Static methods ───────────────────────────────────────────────────────────

OtpSessionSchema.statics.findActiveOtp = function (
  email: string
): Promise<IOtpSessionDocument | null> {
  const normalised = email.toLowerCase().trim();
  return this.findOne({
    email: normalised,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

OtpSessionSchema.statics.createOtpSession = function (
  email: string,
  otpHash: string
): Promise<IOtpSessionDocument> {
  const normalised = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return this.create({ email: normalised, otpHash, expiresAt });
};

// ─── Model ────────────────────────────────────────────────────────────────────

const OtpSession = (
  (mongoose.models.OtpSession as unknown as IOtpSessionModel) ||
  mongoose.model<IOtpSessionDocument, IOtpSessionModel>(
    'OtpSession',
    OtpSessionSchema
  )
) as unknown as IOtpSessionModel;

export default OtpSession;

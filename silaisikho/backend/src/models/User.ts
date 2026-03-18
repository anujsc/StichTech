import mongoose from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  profilePicUrl: string | undefined;
  role: 'student' | 'admin';
  authProvider: 'google' | 'email';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicUrl: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['student', 'admin'],
        message: 'Role must be student or admin',
      },
      default: 'student',
    },
    authProvider: {
      type: String,
      required: true,
      enum: {
        values: ['google', 'email'],
        message: 'AuthProvider must be google or email',
      },
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Static methods ───────────────────────────────────────────────────────────

UserSchema.statics.findByEmail = function (
  email: string
): Promise<IUserDocument | null> {
  const normalised = email.toLowerCase().trim();
  return this.findOne({ email: normalised });
};

// ─── Model ────────────────────────────────────────────────────────────────────

const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;

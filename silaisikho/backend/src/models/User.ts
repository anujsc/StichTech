import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string | undefined;
  mobileNumber: string | undefined;
  passwordHash: string;
  profilePicUrl: string | undefined;
  role: 'student' | 'admin';
  authProvider: 'local';
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
  comparePin(candidatePin: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByIdentifier(identifier: string): Promise<IUserDocument | null>;
}

// ─── Regex ────────────────────────────────────────────────────────────────────

// Matches: 9876543210 | +919876543210 | 09876543210
const MOBILE_REGEX = /^(\+91|0)?[6-9]\d{9}$/;

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
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (value: string): boolean {
          return MOBILE_REGEX.test(value);
        },
        message: 'Please enter a valid 10-digit Indian mobile number',
      },
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
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
        values: ['local'],
        message: 'AuthProvider must be local',
      },
      default: 'local',
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Schema-level validator ───────────────────────────────────────────────────
// Prevents saving a User with neither email nor mobileNumber

UserSchema.pre('validate', function (next): void {
  const hasEmail = typeof this.email === 'string' && this.email.trim().length > 0;
  const hasMobile = typeof this.mobileNumber === 'string' && this.mobileNumber.trim().length > 0;
  if (!hasEmail && !hasMobile) {
    next(new Error('Either email or mobile number must be provided'));
  } else {
    next();
  }
});

// ─── Static methods ───────────────────────────────────────────────────────────

UserSchema.statics.findByIdentifier = function (
  identifier: string
): Promise<IUserDocument | null> {
  const trimmed = identifier.trim();
  if (MOBILE_REGEX.test(trimmed)) {
    return this.findOne({ mobileNumber: trimmed });
  }
  return this.findOne({ email: trimmed.toLowerCase() });
};

// ─── Instance methods ─────────────────────────────────────────────────────────

UserSchema.methods.comparePin = function (
  this: IUserDocument,
  candidatePin: string
): Promise<boolean> {
  return bcrypt.compare(candidatePin, this.passwordHash);
};

// ─── Model ────────────────────────────────────────────────────────────────────

const User: IUserModel =
  (mongoose.models.User as unknown as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;

import mongoose from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IEnrollmentDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amountPaid: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  enrolledAt: Date;
}

export interface IEnrollmentModel extends mongoose.Model<IEnrollmentDocument> {
  findByUser(
    userId: mongoose.Types.ObjectId | string
  ): Promise<IEnrollmentDocument[]>;

  isEnrolled(
    userId: mongoose.Types.ObjectId | string,
    courseId: mongoose.Types.ObjectId | string
  ): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const EnrollmentSchema = new mongoose.Schema<IEnrollmentDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    amountPaid: {
      type: Number,
      required: [true, 'Amount paid is required'],
      min: [0, 'Amount cannot be negative'],
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      required: [true, 'Razorpay payment ID is required'],
      trim: true,
    },
    enrolledAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// 1. Compound unique — prevents double-enrollment even under concurrent requests
EnrollmentSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true, name: 'userId_courseId_unique' }
);

// 2. Standalone userId — covers findByUser query
EnrollmentSchema.index({ userId: 1 });

// 3. Compound courseId + enrolledAt — covers admin student list sorted by recent
EnrollmentSchema.index({ courseId: 1, enrolledAt: -1 });

// ─── Static methods ───────────────────────────────────────────────────────────

EnrollmentSchema.statics.findByUser = function (
  userId: mongoose.Types.ObjectId | string
): Promise<IEnrollmentDocument[]> {
  return this.find({ userId }).sort({ enrolledAt: -1 });
};

EnrollmentSchema.statics.isEnrolled = async function (
  userId: mongoose.Types.ObjectId | string,
  courseId: mongoose.Types.ObjectId | string
): Promise<boolean> {
  const result = await this.exists({ userId, courseId });
  return !!result;
};

// ─── Model ────────────────────────────────────────────────────────────────────

const Enrollment = (
  (mongoose.models.Enrollment as unknown as IEnrollmentModel) ||
  mongoose.model<IEnrollmentDocument, IEnrollmentModel>(
    'Enrollment',
    EnrollmentSchema
  )
) as unknown as IEnrollmentModel;

export default Enrollment;

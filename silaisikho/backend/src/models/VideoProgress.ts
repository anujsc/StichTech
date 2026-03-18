import mongoose from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IVideoProgressDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  videoId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: Date;
  markCompleted(): Promise<IVideoProgressDocument>;
}

export interface IVideoProgressModel extends mongoose.Model<IVideoProgressDocument> {
  findByCourse(
    userId: mongoose.Types.ObjectId | string,
    courseId: mongoose.Types.ObjectId | string
  ): Promise<IVideoProgressDocument[]>;

  findLastWatched(
    userId: mongoose.Types.ObjectId | string,
    courseId: mongoose.Types.ObjectId | string
  ): Promise<IVideoProgressDocument | null>;

  calculateCourseProgress(
    userId: mongoose.Types.ObjectId | string,
    courseId: mongoose.Types.ObjectId | string,
    totalVideos: number
  ): Promise<number>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const VideoProgressSchema = new mongoose.Schema<IVideoProgressDocument>(
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
    videoId: {
      type: String,
      required: [true, 'Video ID is required'],
      trim: true,
    },
    watchedSeconds: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Watched seconds cannot be negative'],
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastWatchedAt: {
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

// 1. Compound unique — makes upsert safe, prevents duplicate progress records
VideoProgressSchema.index(
  { userId: 1, videoId: 1 },
  { unique: true, name: 'userId_videoId_unique' }
);

// 2. Compound userId + courseId — covers findByCourse query
VideoProgressSchema.index({ userId: 1, courseId: 1 });

// 3. Compound courseId + lastWatchedAt desc — covers findLastWatched filter + sort
VideoProgressSchema.index({ courseId: 1, lastWatchedAt: -1 });

// 4. Compound userId + isCompleted — covers calculateCourseProgress count query
VideoProgressSchema.index({ userId: 1, isCompleted: 1 });

// ─── Static methods ───────────────────────────────────────────────────────────

VideoProgressSchema.statics.findByCourse = function (
  userId: mongoose.Types.ObjectId | string,
  courseId: mongoose.Types.ObjectId | string
): Promise<IVideoProgressDocument[]> {
  return this.find({ userId, courseId }).sort({ lastWatchedAt: -1 });
};

VideoProgressSchema.statics.findLastWatched = function (
  userId: mongoose.Types.ObjectId | string,
  courseId: mongoose.Types.ObjectId | string
): Promise<IVideoProgressDocument | null> {
  return this.findOne({ userId, courseId }).sort({ lastWatchedAt: -1 });
};

VideoProgressSchema.statics.calculateCourseProgress = async function (
  userId: mongoose.Types.ObjectId | string,
  courseId: mongoose.Types.ObjectId | string,
  totalVideos: number
): Promise<number> {
  if (totalVideos === 0) return 0;
  const completed: number = await this.countDocuments({
    userId,
    courseId,
    isCompleted: true,
  });
  return Math.round((completed / totalVideos) * 100);
};

// ─── Instance methods ─────────────────────────────────────────────────────────

VideoProgressSchema.methods.markCompleted = function (
  this: IVideoProgressDocument
): Promise<IVideoProgressDocument> {
  this.isCompleted = true;
  this.lastWatchedAt = new Date();
  return this.save();
};

// ─── Model ────────────────────────────────────────────────────────────────────

const VideoProgress = (
  (mongoose.models.VideoProgress as unknown as IVideoProgressModel) ||
  mongoose.model<IVideoProgressDocument, IVideoProgressModel>(
    'VideoProgress',
    VideoProgressSchema
  )
) as unknown as IVideoProgressModel;

export default VideoProgress;

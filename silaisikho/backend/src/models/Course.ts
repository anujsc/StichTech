import mongoose from 'mongoose';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IVideoDocument extends mongoose.Document {
  title: string;
  description: string;
  cloudinaryPublicId: string;
  durationSeconds: number;
  sortOrder: number;
  isFreePreview: boolean;
}

export interface IModuleDocument extends mongoose.Document {
  title: string;
  sortOrder: number;
  videos: mongoose.Types.DocumentArray<IVideoDocument>;
}

export interface ICourseDocument extends mongoose.Document {
  title: string;
  description: string;
  thumbnailColour: 'rose' | 'amber' | 'terracotta' | 'marigold' | 'burgundy' | 'saffron';
  price: number;
  discountedPrice: number | undefined;
  language: 'Hindi' | 'English' | 'Mixed';
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published';
  instructor: mongoose.Types.ObjectId;
  modules: mongoose.Types.DocumentArray<IModuleDocument>;
  totalModules: number;
  totalVideos: number;
  totalDurationSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseModel extends mongoose.Model<ICourseDocument> {
  findPublished(): Promise<ICourseDocument[]>;
}

// ─── VideoSchema ──────────────────────────────────────────────────────────────

const VideoSchema = new mongoose.Schema<IVideoDocument>(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: [200, 'Video title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    durationSeconds: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Duration cannot be negative'],
    },
    sortOrder: {
      type: Number,
      required: true,
      min: [0, 'Sort order cannot be negative'],
    },
    isFreePreview: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    id: true,
    _id: true,
  }
);

// ─── ModuleSchema ─────────────────────────────────────────────────────────────

const ModuleSchema = new mongoose.Schema<IModuleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      maxlength: [200, 'Module title cannot exceed 200 characters'],
    },
    sortOrder: {
      type: Number,
      required: true,
      min: [0, 'Sort order cannot be negative'],
    },
    videos: {
      type: [VideoSchema],
      default: [],
    },
  },
  {
    id: true,
    _id: true,
  }
);

// ─── CourseSchema ─────────────────────────────────────────────────────────────

const CourseSchema = new mongoose.Schema<ICourseDocument>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Course title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    thumbnailColour: {
      type: String,
      required: true,
      enum: {
        values: ['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'],
        message: 'Invalid thumbnail colour',
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      required: false,
      min: [0, 'Discounted price cannot be negative'],
      validate: {
        validator: function (this: ICourseDocument, value: number): boolean {
          return value === undefined || value < this.price;
        },
        message: 'Discounted price must be less than regular price',
      },
    },
    language: {
      type: String,
      required: true,
      enum: {
        values: ['Hindi', 'English', 'Mixed'],
        message: 'Invalid language',
      },
      default: 'Hindi',
    },
    level: {
      type: String,
      required: true,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Invalid course level',
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['draft', 'published'],
        message: 'Invalid status',
      },
      default: 'draft',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modules: {
      type: [ModuleSchema],
      default: [],
    },
    totalModules: {
      type: Number,
      default: 0,
      min: [0, 'Total modules cannot be negative'],
    },
    totalVideos: {
      type: Number,
      default: 0,
      min: [0, 'Total videos cannot be negative'],
    },
    totalDurationSeconds: {
      type: Number,
      default: 0,
      min: [0, 'Total duration cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Pre-save middleware ───────────────────────────────────────────────────────

CourseSchema.pre('save', function (next): void {
  this.totalModules = this.modules.length;

  this.totalVideos = this.modules.reduce(
    (acc: number, mod: IModuleDocument) => acc + mod.videos.length,
    0
  );

  this.totalDurationSeconds = this.modules.reduce(
    (acc: number, mod: IModuleDocument) =>
      acc +
      mod.videos.reduce(
        (vAcc: number, video: IVideoDocument) => vAcc + video.durationSeconds,
        0
      ),
    0
  );

  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ status: 1 });
CourseSchema.index({ instructor: 1, status: 1 });

// ─── Static methods ───────────────────────────────────────────────────────────

CourseSchema.statics.findPublished = function (): Promise<ICourseDocument[]> {
  return this.find({ status: 'published' }).sort({ createdAt: -1 });
};

// ─── Model ────────────────────────────────────────────────────────────────────

const Course = (
  (mongoose.models.Course as unknown as ICourseModel) ||
  mongoose.model<ICourseDocument, ICourseModel>('Course', CourseSchema)
) as unknown as ICourseModel;

export default Course;

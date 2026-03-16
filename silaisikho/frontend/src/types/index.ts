// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  phone?: string;
  city?: string;
  isEmailVerified: boolean;
  isGoogleUser: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface IVideo {
  _id: string;
  title: string;
  description?: string;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  order: number;
  isFreePreview: boolean;
}

export interface IModule {
  _id: string;
  title: string;
  description?: string;
  order: number;
  videos: IVideo[];
}

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  price: number;
  discountedPrice?: number;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  modules: IModule[];
  totalDurationSeconds: number;
  totalVideos: number;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  instructor: Pick<IUser, '_id' | 'name' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export type EnrollmentStatus = 'active' | 'expired' | 'refunded';

export interface IEnrollment {
  _id: string;
  user: string | IUser;
  course: string | ICourse;
  status: EnrollmentStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaid: number;
  enrolledAt: string;
  expiresAt?: string;
}

// ─── Video Progress ───────────────────────────────────────────────────────────

export interface IVideoProgress {
  _id: string;
  user: string;
  course: string;
  video: string;
  watchedSeconds: number;
  durationSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string;
}

export interface ICourseProgress {
  courseId: string;
  totalVideos: number;
  completedVideos: number;
  percentComplete: number;
  videoProgressMap: Record<string, IVideoProgress>;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface ITestimonial {
  _id: string;
  user: Pick<IUser, '_id' | 'name' | 'avatar' | 'city'>;
  course: Pick<ICourse, '_id' | 'title'>;
  quote: string;
  rating: number;
}

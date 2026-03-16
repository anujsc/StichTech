// ─── Primitive unions ─────────────────────────────────────────────────────────

export type ThumbnailColour =
  | 'rose'
  | 'amber'
  | 'terracotta'
  | 'marigold'
  | 'burgundy'
  | 'saffron';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseStatus = 'draft' | 'published';

export type CourseLanguage = 'Hindi' | 'English' | 'Mixed';

export type UserRole = 'student' | 'admin';

export type AuthProvider = 'google' | 'email';

// ─── Video & Course ───────────────────────────────────────────────────────────

export interface IVideo {
  id: string;
  title: string;
  description: string;
  cloudinaryPublicId: string;
  durationSeconds: number;
  sortOrder: number;
  isFreePreview: boolean;
}

export interface IModule {
  id: string;
  title: string;
  sortOrder: number;
  videos: IVideo[];
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnailColour: ThumbnailColour;
  price: number;
  discountedPrice?: number;
  language: CourseLanguage;
  level: CourseLevel;
  status: CourseStatus;
  instructorName: string;
  instructorBio?: string;
  totalModules: number;
  totalVideos: number;
  totalDurationSeconds: number;
  modules: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  createdAt: Date;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export interface IEnrollment {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  courseThumbnailColour: ThumbnailColour;
  amountPaid: number;
  enrolledAt: Date;
  progressPercentage: number;
}

// ─── Video Progress ───────────────────────────────────────────────────────────

export interface IVideoProgress {
  id: string;
  userId: string;
  courseId: string;
  videoId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: Date;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface ITestimonial {
  id: string;
  studentName: string;
  city: string;
  rating: number;
  quoteHindi: string;
  quoteEnglish: string;
  courseEnrolled?: string;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface IFaqItem {
  id: string;
  questionHindi: string;
  questionEnglish: string;
  answerHindi: string;
  answerEnglish: string;
}

// ─── API wrappers ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

// ─── ThumbnailGradientMap ─────────────────────────────────────────────────────
// Runtime const — used by CourseCard to look up Tailwind gradient classes.
// All classes are safelisted in tailwind.config.js.

export const ThumbnailGradientMap: Record<ThumbnailColour, string> = {
  rose:       'bg-gradient-to-br from-rose-100 to-rose-300',
  amber:      'bg-gradient-to-br from-amber-100 to-amber-300',
  terracotta: 'bg-gradient-to-br from-red-100 via-orange-200 to-red-300',
  marigold:   'bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200',
  burgundy:   'bg-gradient-to-br from-rose-200 via-pink-300 to-red-400',
  saffron:    'bg-gradient-to-br from-orange-100 via-amber-200 to-yellow-200',
};

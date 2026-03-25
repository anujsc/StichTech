import { z } from 'zod';

// ─── Query Parameter Schemas ──────────────────────────────────────────────────

export const courseListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 12))
    .pipe(z.number().int().min(1).max(50).default(12)),
  
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional(),
  
  language: z
    .enum(['Hindi', 'English', 'Mixed'])
    .optional(),
  
  sort: z
    .enum(['newest', 'price-asc', 'price-desc'])
    .optional()
    .default('newest'),
  
  search: z
    .string()
    .trim()
    .optional(),
});

export const courseSearchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, 'Search query is required — खोज शब्द डालें'),
  
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 12))
    .pipe(z.number().int().min(1).max(50).default(12)),
  
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional(),
  
  language: z
    .enum(['Hindi', 'English', 'Mixed'])
    .optional(),
  
  sort: z
    .enum(['newest', 'price-asc', 'price-desc'])
    .optional()
    .default('newest'),
});

// ─── Params Schemas ───────────────────────────────────────────────────────────

export const courseByIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format — गलत course ID'),
});

export const courseBySlugParamsSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format — गलत slug'),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CourseListQuery = z.infer<typeof courseListQuerySchema>;
export type CourseSearchQuery = z.infer<typeof courseSearchQuerySchema>;
export type CourseByIdParams = z.infer<typeof courseByIdParamsSchema>;
export type CourseBySlugParams = z.infer<typeof courseBySlugParamsSchema>;

// ─── Admin Schemas ────────────────────────────────────────────────────────────

export const adminListQuerySchema = z.object({
  status: z
    .enum(['all', 'draft', 'published'])
    .optional()
    .default('all'),
  
  search: z
    .string()
    .trim()
    .optional(),
  
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(50).default(20)),
});

export const adminCreateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters — शीर्षक कम से कम 3 अक्षर का होना चाहिए')
    .max(200, 'Title cannot exceed 200 characters — शीर्षक 200 अक्षर से अधिक नहीं हो सकता'),
  
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters — विवरण कम से कम 10 अक्षर का होना चाहिए'),
  
  price: z
    .number()
    .min(0, 'Price cannot be negative — कीमत नकारात्मक नहीं हो सकती'),
  
  discountedPrice: z
    .number()
    .min(0, 'Discounted price cannot be negative — डिस्काउंट कीमत नकारात्मक नहीं हो सकती')
    .optional(),
  
  language: z
    .enum(['Hindi', 'English', 'Mixed'], {
      errorMap: () => ({ message: 'Language must be Hindi, English, or Mixed — भाषा Hindi, English, या Mixed होनी चाहिए' }),
    }),
  
  level: z
    .enum(['beginner', 'intermediate', 'advanced'], {
      errorMap: () => ({ message: 'Level must be beginner, intermediate, or advanced — स्तर beginner, intermediate, या advanced होना चाहिए' }),
    }),
  
  thumbnailColour: z
    .enum(['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'], {
      errorMap: () => ({ message: 'Invalid thumbnail colour — गलत thumbnail रंग' }),
    }),
}).refine(
  (data) => {
    if (data.discountedPrice !== undefined) {
      return data.discountedPrice < data.price;
    }
    return true;
  },
  {
    message: 'Discounted price must be less than regular price — डिस्काउंट कीमत मूल कीमत से कम होनी चाहिए',
    path: ['discountedPrice'],
  }
);

export const adminUpdateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters — शीर्षक कम से कम 3 अक्षर का होना चाहिए')
    .max(200, 'Title cannot exceed 200 characters — शीर्षक 200 अक्षर से अधिक नहीं हो सकता')
    .optional(),
  
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters — विवरण कम से कम 10 अक्षर का होना चाहिए')
    .optional(),
  
  price: z
    .number()
    .min(0, 'Price cannot be negative — कीमत नकारात्मक नहीं हो सकती')
    .optional(),
  
  discountedPrice: z
    .number()
    .min(0, 'Discounted price cannot be negative — डिस्काउंट कीमत नकारात्मक नहीं हो सकती')
    .optional()
    .nullable(),
  
  language: z
    .enum(['Hindi', 'English', 'Mixed'])
    .optional(),
  
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional(),
  
  thumbnailColour: z
    .enum(['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'])
    .optional(),
  
  status: z
    .enum(['draft', 'published'])
    .optional(),
});

export const adminCourseIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format — गलत course ID'),
});

export const adminStudentListQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional(),
  
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(50).default(20)),
});

// ─── Admin Inferred Types ─────────────────────────────────────────────────────

export type AdminListQuery = z.infer<typeof adminListQuerySchema>;
export type AdminCreateCourse = z.infer<typeof adminCreateCourseSchema>;
export type AdminUpdateCourse = z.infer<typeof adminUpdateCourseSchema>;
export type AdminCourseIdParam = z.infer<typeof adminCourseIdParamSchema>;
export type AdminStudentListQuery = z.infer<typeof adminStudentListQuerySchema>;

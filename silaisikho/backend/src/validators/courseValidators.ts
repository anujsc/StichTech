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

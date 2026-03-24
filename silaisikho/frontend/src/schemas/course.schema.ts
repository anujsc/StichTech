import { z } from 'zod';
import type { ThumbnailColour, CourseLanguage, CourseLevel } from '@/types';

// ─── Course Schema ────────────────────────────────────────────────────────────
export const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters — शीर्षक कम से कम 5 अक्षर का होना चाहिए'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  price: z.number({ invalid_type_error: 'Price is required' }).min(99).max(9999),
  language: z.enum(['Hindi', 'English', 'Mixed'] as [CourseLanguage, ...CourseLanguage[]]),
  level: z.enum(['beginner', 'intermediate', 'advanced'] as [CourseLevel, ...CourseLevel[]]),
  thumbnailColour: z.enum(['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'] as [ThumbnailColour, ...ThumbnailColour[]]),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

// ─── Video Schema ─────────────────────────────────────────────────────────────
export const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────
export const THUMB_COLOURS: ThumbnailColour[] = ['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'];
export const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced'];
export const LANGUAGES: CourseLanguage[] = ['Hindi', 'English', 'Mixed'];

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const inputCls = 'w-full rounded-xl border border-warm-border px-4 py-3 text-base text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors';
export const errCls = 'text-brand text-sm mt-1';

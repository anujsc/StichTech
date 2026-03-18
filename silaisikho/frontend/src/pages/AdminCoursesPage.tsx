import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Pencil, Trash2, Users, BookX } from 'lucide-react';
import { clsx } from 'clsx';
import { AdminLayout, ConfirmDialog, FormDrawer, useToast } from '@/components/shared';
import { Button, Badge, BilingualLabel, EmptyState } from '@/components/ui';
import { MOCK_COURSES, MOCK_ENROLLMENTS } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import type { ICourse, ThumbnailColour, CourseLanguage, CourseLevel } from '@/types';

// ─── Zod schema ───────────────────────────────────────────────────────────────
const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters — शीर्षक कम से कम 5 अक्षर का होना चाहिए'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  price: z.number({ invalid_type_error: 'Price is required' }).min(99).max(9999),
  language: z.enum(['Hindi', 'English', 'Mixed'] as [CourseLanguage, ...CourseLanguage[]]),
  level: z.enum(['beginner', 'intermediate', 'advanced'] as [CourseLevel, ...CourseLevel[]]),
  thumbnailColour: z.enum(['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'] as [ThumbnailColour, ...ThumbnailColour[]]),
});
type CourseFormValues = z.infer<typeof courseSchema>;

const THUMB_COLOURS: ThumbnailColour[] = ['rose', 'amber', 'terracotta', 'marigold', 'burgundy', 'saffron'];
const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced'];

// ─── Create Course Form ───────────────────────────────────────────────────────
interface CreateCourseFormProps {
  onSave: (course: ICourse) => void;
  onClose: () => void;
}

function CreateCourseForm({ onSave, onClose }: CreateCourseFormProps) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { language: 'Hindi', level: 'beginner', thumbnailColour: 'rose' },
  });

  const selectedColour = watch('thumbnailColour');
  const selectedLevel = watch('level');

  const buildCourse = useCallback((data: CourseFormValues, status: ICourse['status']): ICourse => ({
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    thumbnailColour: data.thumbnailColour,
    price: data.price,
    language: data.language,
    level: data.level,
    status,
    instructorName: 'Sunita Devi',
    totalModules: 0,
    totalVideos: 0,
    totalDurationSeconds: 0,
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }), []);

  const onDraft = handleSubmit((data) => { onSave(buildCourse(data, 'draft')); onClose(); });
  const onPublish = handleSubmit((data) => { onSave(buildCourse(data, 'published')); onClose(); });

  const inputCls = 'w-full rounded-xl border border-warm-border px-4 py-3 text-base text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors';
  const errCls = 'text-brand text-sm mt-1';

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <BilingualLabel english="Course Title" hindi="कोर्स का शीर्षक" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <input type="text" {...register('title')} placeholder="e.g. Basic Blouse Stitching" className={inputCls} />
        {errors.title && <p className={errCls}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <BilingualLabel english="Description" hindi="विवरण" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <textarea rows={4} {...register('description')} placeholder="Describe what students will learn…" className={clsx(inputCls, 'resize-none')} />
        {errors.description && <p className={errCls}>{errors.description.message}</p>}
      </div>

      {/* Price */}
      <div>
        <BilingualLabel english="Price" hindi="कीमत" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none">₹</span>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="499"
            className={clsx(inputCls, 'pl-8')}
          />
        </div>
        {errors.price && <p className={errCls}>{errors.price.message}</p>}
      </div>

      {/* Thumbnail colour */}
      <div>
        <BilingualLabel english="Thumbnail Colour" hindi="थंबनेल रंग" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-2" />
        <div className="flex gap-3 flex-wrap">
          {THUMB_COLOURS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue('thumbnailColour', c)}
              className={clsx(
                'w-10 h-10 rounded-full cursor-pointer transition-all',
                ThumbnailGradientMap[c],
                selectedColour === c ? 'ring-2 ring-offset-2 ring-brand' : ''
              )}
              aria-label={c}
            />
          ))}
        </div>
        {errors.thumbnailColour && <p className={errCls}>{errors.thumbnailColour.message}</p>}
      </div>

      {/* Language */}
      <div>
        <BilingualLabel english="Language" hindi="भाषा" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <select {...field} className={inputCls}>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Mixed">Mixed</option>
            </select>
          )}
        />
        {errors.language && <p className={errCls}>{errors.language.message}</p>}
      </div>

      {/* Level */}
      <div>
        <BilingualLabel english="Level" hindi="स्तर" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-2" />
        <div className="flex gap-3 flex-wrap">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setValue('level', l)}
              className={clsx(
                'rounded-full px-4 py-2 text-sm border transition-colors capitalize',
                selectedLevel === l ? 'bg-brand text-white border-brand' : 'border-warm-border text-warm-text hover:border-brand'
              )}
            >
              {l}
            </button>
          ))}
        </div>
        {errors.level && <p className={errCls}>{errors.level.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-warm-border">
        <Button variant="outline" size="md" onClick={onDraft}>Save as Draft — Draft में Save करें</Button>
        <Button variant="primary" size="md" onClick={onPublish}>Publish करें — Publish</Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<ICourse[]>(MOCK_COURSES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDrawer, setShowCreateDrawer] = useState<boolean>(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  const enrollmentCount = useCallback((courseId: string) =>
    MOCK_ENROLLMENTS.filter((e) => e.courseId === courseId).length, []);

  const handleAddCourse = useCallback((course: ICourse) => {
    setCourses((prev) => [course, ...prev]);
    showToast('Course created successfully — कोर्स बन गया');
  }, [showToast]);

  const handleDeleteConfirm = useCallback(() => {
    setCourses((prev) => prev.filter((c) => c.id !== deletingCourseId));
    setDeletingCourseId('');
  }, [deletingCourseId]);

  const inputCls = 'rounded-full border border-warm-border px-4 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors';

  return (
    <AdminLayout
      pageTitle="My Courses — मेरे कोर्स"
      actionButton={
        <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => setShowCreateDrawer(true)}>
          New Course +
        </Button>
      }
    >
      <div className="page-enter">

        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-muted rounded w-48" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
                <div className="w-16 h-6 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
        {/* Search & filter */}
        <div className="flex gap-4 flex-wrap mb-6">          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses…"
              className={clsx(inputCls, 'pl-10 w-full')}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputCls}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Course list */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            icon={<BookX />}
            englishMessage="No courses found"
            hindiMessage="कोई कोर्स नहीं मिला"
            action={{ label: 'Create New Course', onClick: () => setShowCreateDrawer(true) }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 hover:bg-muted transition-all">
                {/* Thumbnail */}
                <div className={clsx('w-12 h-12 rounded-xl shrink-0', ThumbnailGradientMap[course.thumbnailColour])} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-navy font-semibold text-base truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <Badge variant={`language-${course.language.toLowerCase()}` as 'language-hindi'} label={course.language} />
                    <Badge variant={`level-${course.level}` as 'level-beginner'} label={course.level} />
                    <span className="text-warm-text text-sm">{course.totalModules} modules</span>
                    <span className="text-warm-text text-sm">{course.totalVideos} videos</span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={`status-${course.status}` as 'status-published'} label={course.status} />
                  <div className="flex items-center gap-1 text-warm-text text-sm">
                    <Users size={14} />
                    <span>{enrollmentCount(course.id)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                    className="p-2 text-warm-text hover:text-brand transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Edit course"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeletingCourseId(course.id); setShowDeleteConfirm(true); }}
                    className="p-2 text-warm-text hover:text-red-500 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Delete course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Course — कोर्स हटाएं"
        message="Are you sure you want to delete this course? This cannot be undone — क्या आप वाकई इस कोर्स को हटाना चाहती हैं?"
        confirmLabel="Delete — हटाएं"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />

      {/* Create drawer */}
      <FormDrawer
        isOpen={showCreateDrawer}
        title="Create New Course"
        hindiTitle="नया कोर्स बनाएं"
        onClose={() => setShowCreateDrawer(false)}
      >
        <CreateCourseForm onSave={handleAddCourse} onClose={() => setShowCreateDrawer(false)} />
      </FormDrawer>

    </AdminLayout>
  );
}
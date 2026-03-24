import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExternalLink, Pencil, Trash2, Plus, GripVertical,
  Play, Lock, Upload, CheckCircle, FileX, Video as VideoIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { AdminLayout, ConfirmDialog, FormDrawer } from '@/components/shared';
import { Button, Badge, BilingualLabel, ProgressBar, EmptyState } from '@/components/ui';
import { MOCK_COURSES, MOCK_ENROLLMENTS } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import type { ICourse, IModule, IVideo, ThumbnailColour, CourseLanguage, CourseLevel } from '@/types';
import { courseSchema, videoSchema, type CourseFormValues, type VideoFormValues, THUMB_COLOURS, LEVELS, inputCls, errCls } from '@/schemas/course.schema';
import { formatDuration } from '@/utils/format';

// ─── Edit Course Form ─────────────────────────────────────────────────────────
interface EditCourseFormProps {
  course: ICourse;
  onSave: (vals: CourseFormValues) => void;
  onClose: () => void;
}

function EditCourseForm({ course, onSave, onClose }: EditCourseFormProps) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
      language: course.language,
      level: course.level,
      thumbnailColour: course.thumbnailColour,
    },
  });
  const selectedColour = watch('thumbnailColour');
  const selectedLevel = watch('level');
  const onSubmit = handleSubmit((data) => { onSave(data); onClose(); });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <BilingualLabel english="Course Title" hindi="कोर्स का शीर्षक" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <input type="text" {...register('title')} className={inputCls} />
        {errors.title && <p className={errCls}>{errors.title.message}</p>}
      </div>
      <div>
        <BilingualLabel english="Description" hindi="विवरण" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <textarea rows={4} {...register('description')} className={clsx(inputCls, 'resize-none')} />
        {errors.description && <p className={errCls}>{errors.description.message}</p>}
      </div>
      <div>
        <BilingualLabel english="Price" hindi="कीमत" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none">₹</span>
          <input type="number" {...register('price', { valueAsNumber: true })} className={clsx(inputCls, 'pl-8')} />
        </div>
        {errors.price && <p className={errCls}>{errors.price.message}</p>}
      </div>
      <div>
        <BilingualLabel english="Thumbnail Colour" hindi="थंबनेल रंग" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-2" />
        <div className="flex gap-3 flex-wrap">
          {THUMB_COLOURS.map((c) => (
            <button key={c} type="button" onClick={() => setValue('thumbnailColour', c)}
              className={clsx('w-10 h-10 rounded-full cursor-pointer transition-all', ThumbnailGradientMap[c], selectedColour === c ? 'ring-2 ring-offset-2 ring-brand' : '')}
              aria-label={c} />
          ))}
        </div>
      </div>
      <div>
        <BilingualLabel english="Language" hindi="भाषा" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-1.5" />
        <Controller name="language" control={control} render={({ field }) => (
          <select {...field} className={inputCls}>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Mixed">Mixed</option>
          </select>
        )} />
      </div>
      <div>
        <BilingualLabel english="Level" hindi="स्तर" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" className="mb-2" />
        <div className="flex gap-3 flex-wrap">
          {LEVELS.map((l) => (
            <button key={l} type="button" onClick={() => setValue('level', l)}
              className={clsx('rounded-full px-4 py-2 text-sm border transition-colors capitalize', selectedLevel === l ? 'bg-brand text-white border-brand' : 'border-warm-border text-warm-text hover:border-brand')}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-warm-border">
        <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" onClick={onSubmit}>Save Changes</Button>
      </div>
    </div>
  );
}

// ─── Add Video Form ───────────────────────────────────────────────────────────
interface AddVideoFormProps {
  moduleId: string;
  onSave: (moduleId: string, video: IVideo) => void;
  onCancel: () => void;
}

function AddVideoForm({ moduleId, onSave, onCancel }: AddVideoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  });
  const [isFreePreview, setIsFreePreview] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (uploadState !== 'uploading') return;
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [uploadState]);

  const onSubmit = handleSubmit((data) => {
    onSave(moduleId, {
      id: Date.now().toString(),
      title: data.title,
      description: data.description ?? '',
      cloudinaryPublicId: `ss/mock_${Date.now()}`,
      durationSeconds: 932,
      sortOrder: 0,
      isFreePreview,
    });
  });

  return (
    <div className="border-2 border-dashed border-warm-border mx-4 my-4 rounded-xl p-4 bg-surface">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-navy text-sm font-medium block mb-1">Video Title</label>
          <input type="text" {...register('title')} placeholder="Video title — वीडियो का नाम" className={clsx(inputCls, 'text-sm py-2')} />
          {errors.title && <p className={errCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className="text-navy text-sm font-medium block mb-1">Description (optional)</label>
          <textarea rows={2} {...register('description')} placeholder="Brief description…" className={clsx(inputCls, 'resize-none text-sm py-2')} />
        </div>

        {/* Free preview toggle */}
        <div className="flex items-center justify-between">
          <BilingualLabel english="Free Preview" hindi="फ्री Preview" englishSize="sm" englishWeight="medium" hindiSize="xs" gap="tight" />
          <button
            type="button"
            onClick={() => setIsFreePreview((p) => !p)}
            className={clsx('relative w-12 h-6 rounded-full transition-colors duration-200', isFreePreview ? 'bg-brand' : 'bg-warm-border')}
            aria-label="Toggle free preview"
          >
            <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', isFreePreview ? 'translate-x-6' : 'translate-x-0.5')} />
          </button>
        </div>

        {/* Upload area */}
        {uploadState === 'idle' && (
          <div
            onClick={() => setUploadState('uploading')}
            className="border-2 border-dashed border-warm-border rounded-xl p-8 text-center cursor-pointer hover:border-brand transition-all"
          >
            <Upload size={40} className="text-warm-text mx-auto" />
            <p className="text-navy text-base font-medium mt-2">Video Upload करें</p>
            <p className="text-warm-text text-sm">Click or drag file here</p>
          </div>
        )}
        {uploadState === 'uploading' && (
          <div className="rounded-xl border border-warm-border p-4">
            <p className="text-navy text-sm font-medium mb-2">Uploading…</p>
            <ProgressBar percentage={uploadProgress} showLabel labelPosition="right" size="sm" />
          </div>
        )}
        {uploadState === 'complete' && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
            <CheckCircle size={18} className="text-green-500 shrink-0" />
            <span className="text-green-700 text-sm">Upload complete — अपलोड पूरा</span>
            <Badge variant="count" label="15:32" className="ml-auto" />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={() => { onCancel(); setUploadState('idle'); setUploadProgress(0); }}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onSubmit}>Save Video — सेव करें</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCourseEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const found = useMemo(() => MOCK_COURSES.find((c) => c.id === courseId), [courseId]);
  const [course, setCourse] = useState<ICourse | null>(found ?? null);

  const [openModuleId, setOpenModuleId] = useState<string>(found?.modules[0]?.id ?? '');
  const [editingModuleId, setEditingModuleId] = useState<string>('');
  const [addingVideoToModuleId, setAddingVideoToModuleId] = useState<string>('');
  const [showAddModuleInput, setShowAddModuleInput] = useState<boolean>(false);
  const [newModuleTitle, setNewModuleTitle] = useState<string>('');
  const [deletingModuleId, setDeletingModuleId] = useState<string>('');
  const [deletingVideoId, setDeletingVideoId] = useState<string>('');
  const [showDeleteModuleConfirm, setShowDeleteModuleConfirm] = useState<boolean>(false);
  const [showDeleteVideoConfirm, setShowDeleteVideoConfirm] = useState<boolean>(false);
  const [showEditDrawer, setShowEditDrawer] = useState<boolean>(false);

  const enrolledCount = useMemo(() =>
    MOCK_ENROLLMENTS.filter((e) => e.courseId === courseId).length, [courseId]);

  const handleEditSave = useCallback((vals: CourseFormValues) => {
    if (!course) return;
    setCourse((prev) => prev ? { ...prev, ...vals, updatedAt: new Date() } : prev);
  }, [course]);

  const handleAddModule = useCallback(() => {
    if (!newModuleTitle.trim() || !course) return;
    const newMod: IModule = {
      id: Date.now().toString(),
      title: newModuleTitle.trim(),
      sortOrder: course.modules.length + 1,
      videos: [],
    };
    setCourse((prev) => prev ? { ...prev, modules: [...prev.modules, newMod], totalModules: prev.totalModules + 1 } : prev);
    setNewModuleTitle('');
    setShowAddModuleInput(false);
  }, [newModuleTitle, course]);

  const handleSaveModuleTitle = useCallback((moduleId: string, title: string) => {
    setCourse((prev) => prev ? {
      ...prev,
      modules: prev.modules.map((m) => m.id === moduleId ? { ...m, title } : m),
    } : prev);
    setEditingModuleId('');
  }, []);

  const handleDeleteModule = useCallback(() => {
    setCourse((prev) => prev ? {
      ...prev,
      modules: prev.modules.filter((m) => m.id !== deletingModuleId),
      totalModules: Math.max(0, prev.totalModules - 1),
    } : prev);
    setDeletingModuleId('');
  }, [deletingModuleId]);

  const handleAddVideo = useCallback((moduleId: string, video: IVideo) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const modules = prev.modules.map((m) => {
        if (m.id !== moduleId) return m;
        const sortOrder = m.videos.length + 1;
        return { ...m, videos: [...m.videos, { ...video, sortOrder }] };
      });
      return { ...prev, modules, totalVideos: prev.totalVideos + 1 };
    });
    setAddingVideoToModuleId('');
  }, []);

  const handleToggleFreePreview = useCallback((moduleId: string, videoId: string) => {
    setCourse((prev) => prev ? {
      ...prev,
      modules: prev.modules.map((m) => m.id !== moduleId ? m : {
        ...m,
        videos: m.videos.map((v) => v.id !== videoId ? v : { ...v, isFreePreview: !v.isFreePreview }),
      }),
    } : prev);
  }, []);

  const handleDeleteVideo = useCallback(() => {
    setCourse((prev) => {
      if (!prev) return prev;
      const modules = prev.modules.map((m) => ({
        ...m,
        videos: m.videos.filter((v) => v.id !== deletingVideoId),
      }));
      return { ...prev, modules, totalVideos: Math.max(0, prev.totalVideos - 1) };
    });
    setDeletingVideoId('');
  }, [deletingVideoId]);

  if (!course) {
    return (
      <AdminLayout pageTitle="Course Editor">
        <EmptyState
          icon={<FileX />}
          englishMessage="Course not found"
          hindiMessage="कोर्स नहीं मिला"
          action={{ label: 'Back to Courses', onClick: () => navigate('/admin/courses') }}
        />
      </AdminLayout>
    );
  }

  const totalDur = course.modules.reduce((s, m) => s + m.videos.reduce((vs, v) => vs + v.durationSeconds, 0), 0);

  return (
    <AdminLayout
      pageTitle={course.title.length > 40 ? course.title.slice(0, 40) + '…' : course.title}
      actionButton={
        <Button variant="outline" size="md" icon={<ExternalLink size={16} />}
          onClick={() => window.open(`/courses/${course.id}`, '_blank')}>
          Preview Course — Preview देखें
        </Button>
      }
    >
      <div className="page-enter grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Course summary card */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className={clsx('w-full h-24 rounded-xl', ThumbnailGradientMap[course.thumbnailColour])} />
            <p className="text-navy font-semibold text-base mt-3">{course.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={`status-${course.status}` as 'status-published'} label={course.status} />
              <span className="text-warm-text text-sm">{course.instructorName}</span>
            </div>
            <p className="text-warm-text text-sm mt-1">{enrolledCount} enrolled</p>
            <Button variant="outline" size="sm" fullWidth icon={<Pencil size={14} />} onClick={() => setShowEditDrawer(true)} className="mt-4">
              Edit Course Details
            </Button>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            {[
              { en: 'Total Modules', hi: 'कुल मॉड्यूल', val: course.modules.length },
              { en: 'Total Videos', hi: 'कुल वीडियो', val: course.totalVideos },
              { en: 'Total Duration', hi: 'कुल अवधि', val: formatDuration(totalDur) },
            ].map((row, i, arr) => (
              <div key={row.en} className={clsx('flex items-center justify-between py-2', i < arr.length - 1 ? 'border-b border-warm-border' : '')}>
                <BilingualLabel english={row.en} hindi={row.hi} englishSize="sm" hindiSize="xs" gap="tight" />
                <span className="text-navy font-semibold text-sm">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">

          {/* Modules heading */}
          <div className="flex items-center justify-between mb-4">
            <BilingualLabel english="Modules and Videos" hindi="मॉड्यूल और वीडियो" englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" />
            <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => setShowAddModuleInput(true)}>
              Add Module +
            </Button>
          </div>

          {/* Add module inline form */}
          {showAddModuleInput && (
            <div className="bg-white rounded-xl border border-warm-border p-4 mb-4">
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                placeholder="Module title — मॉड्यूल का नाम"
                className={clsx(inputCls, 'text-sm py-2')}
                autoFocus
              />
              <div className="flex gap-3 mt-3">
                <Button variant="primary" size="sm" onClick={handleAddModule}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowAddModuleInput(false); setNewModuleTitle(''); }}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Modules list */}
          {[...course.modules].sort((a, b) => a.sortOrder - b.sortOrder).map((mod) => {
            const isOpen = openModuleId === mod.id;
            const isEditing = editingModuleId === mod.id;
            const isAddingVideo = addingVideoToModuleId === mod.id;

            return (
              <div key={mod.id} className="bg-white rounded-2xl shadow-card mb-4 overflow-hidden">
                {/* Module header */}
                <div className="bg-muted px-5 py-4 flex items-center gap-3">
                  <GripVertical size={18} className="text-warm-text opacity-40 shrink-0" />
                  {isEditing ? (
                    <ModuleTitleInput
                      defaultValue={mod.title}
                      onSave={(t) => handleSaveModuleTitle(mod.id, t)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                      className="text-navy font-semibold text-base flex-1 text-left"
                    >
                      {mod.title}
                    </button>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => setEditingModuleId(mod.id)}
                      className="p-1.5 text-warm-text hover:text-brand transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => { setDeletingModuleId(mod.id); setShowDeleteModuleConfirm(true); }}
                      className="p-1.5 text-warm-text hover:text-red-500 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <Trash2 size={14} />
                    </button>
                    <Button variant="outline" size="sm" icon={<Plus size={12} />}
                      onClick={() => setAddingVideoToModuleId(isAddingVideo ? '' : mod.id)}>
                      Add Video
                    </Button>
                  </div>
                </div>

                {/* Add video form */}
                {isAddingVideo && (
                  <AddVideoForm
                    moduleId={mod.id}
                    onSave={handleAddVideo}
                    onCancel={() => setAddingVideoToModuleId('')}
                  />
                )}

                {/* Video list */}
                {isOpen && !isAddingVideo && (
                  <>
                    {mod.videos.length === 0 ? (
                      <div className="p-4">
                        <EmptyState
                          icon={<VideoIcon />}
                          englishMessage="No videos yet"
                          hindiMessage="अभी कोई वीडियो नहीं"
                          action={{ label: 'Add Video', onClick: () => setAddingVideoToModuleId(mod.id) }}
                        />
                      </div>
                    ) : (
                      [...mod.videos].sort((a, b) => a.sortOrder - b.sortOrder).map((v) => (
                        <div key={v.id} className="flex items-center px-5 py-3 border-t border-warm-border hover:bg-muted transition-colors">
                          {v.isFreePreview
                            ? <Play size={14} className="text-brand shrink-0" />
                            : <Lock size={14} className="text-warm-text shrink-0" />}
                          <span className="text-navy text-sm ml-3 flex-1 truncate">{v.title}</span>
                          {v.isFreePreview && <Badge variant="status-published" label="Free Preview" className="mr-2" />}
                          <span className="text-warm-text text-xs mr-3">{Math.floor(v.durationSeconds / 60)}:{String(v.durationSeconds % 60).padStart(2, '0')}</span>
                          {/* Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleFreePreview(mod.id, v.id)}
                            className={clsx('relative w-10 h-5 rounded-full transition-colors duration-200 mr-2', v.isFreePreview ? 'bg-brand' : 'bg-warm-border')}
                            aria-label="Toggle free preview"
                          >
                            <span className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200', v.isFreePreview ? 'translate-x-5' : 'translate-x-0.5')} />
                          </button>
                          <button type="button"
                            onClick={() => { setDeletingVideoId(v.id); setShowDeleteVideoConfirm(true); }}
                            className="p-1.5 text-warm-text hover:text-red-500 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirms */}
      <ConfirmDialog
        isOpen={showDeleteModuleConfirm}
        title="Delete Module — मॉड्यूल हटाएं"
        message="Are you sure? All videos in this module will be removed."
        confirmLabel="Delete — हटाएं"
        variant="danger"
        onConfirm={handleDeleteModule}
        onClose={() => setShowDeleteModuleConfirm(false)}
      />
      <ConfirmDialog
        isOpen={showDeleteVideoConfirm}
        title="Delete Video — वीडियो हटाएं"
        message="Are you sure you want to delete this video?"
        confirmLabel="Delete — हटाएं"
        variant="danger"
        onConfirm={handleDeleteVideo}
        onClose={() => setShowDeleteVideoConfirm(false)}
      />

      {/* Edit drawer */}
      <FormDrawer isOpen={showEditDrawer} title="Edit Course Details" hindiTitle="कोर्स विवरण संपादित करें" onClose={() => setShowEditDrawer(false)}>
        <EditCourseForm course={course} onSave={handleEditSave} onClose={() => setShowEditDrawer(false)} />
      </FormDrawer>
    </AdminLayout>
  );
}

// ─── Inline module title input ────────────────────────────────────────────────
function ModuleTitleInput({ defaultValue, onSave }: { defaultValue: string; onSave: (t: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [val, setVal] = useState<string>(defaultValue);
  return (
    <input
      ref={ref}
      autoFocus
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onSave(val)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSave(val); }}
      className="flex-1 border border-brand rounded-lg px-3 py-1 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
    />
  );
}

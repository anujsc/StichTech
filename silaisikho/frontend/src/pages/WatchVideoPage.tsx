import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, CheckCircle, Circle, ChevronDown, ChevronUp, ArrowLeft, List } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, ProgressBar, EmptyState, BilingualLabel } from '@/components/ui';
import { MOCK_COURSES, MOCK_VIDEO_PROGRESS, MOCK_STUDENTS } from '@/mockData';
import { ThumbnailGradientMap } from '@/types';
import type { IVideo, IModule } from '@/types';

const CURRENT_USER = MOCK_STUDENTS[0];

const QUALITY_OPTIONS = ['360p', '480p', '720p'] as const;
type Quality = typeof QUALITY_OPTIONS[number];

function fmtDur(s: number): string {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function WatchVideoPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const navigate = useNavigate();

  const course = useMemo(() => MOCK_COURSES.find((c) => c.id === courseId), [courseId]);

  // Flatten all videos in order
  const allVideos = useMemo<IVideo[]>(
    () => course?.modules.flatMap((m) => m.videos) ?? [],
    [course]
  );

  const currentVideo = useMemo<IVideo | null>(
    () => allVideos.find((v) => v.id === videoId) ?? null,
    [allVideos, videoId]
  );

  // Which module contains the current video
  const currentModule = useMemo<IModule | null>(
    () => course?.modules.find((m) => m.videos.some((v) => v.id === videoId)) ?? null,
    [course, videoId]
  );

  // Completed video IDs for this user/course
  const completedIds = useMemo<Set<string>>(
    () => new Set(
      MOCK_VIDEO_PROGRESS
        .filter((vp) => vp.userId === CURRENT_USER.id && vp.courseId === courseId && vp.isCompleted)
        .map((vp) => vp.videoId)
    ),
    [courseId]
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrubValue, setScrubValue] = useState<number>(0);
  const [quality, setQuality] = useState<Quality>('720p');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [openModuleId, setOpenModuleId] = useState<string>(currentModule?.id ?? '');

  // Sync open module when video changes
  useEffect(() => {
    if (currentModule) setOpenModuleId(currentModule.id);
    setIsPlaying(false);
    setScrubValue(0);
  }, [videoId, currentModule]);

  // Simulate scrubber advancing when playing
  useEffect(() => {
    if (!isPlaying || !currentVideo) return;
    const interval = setInterval(() => {
      setScrubValue((prev) => {
        if (prev >= currentVideo.durationSeconds) { setIsPlaying(false); return currentVideo.durationSeconds; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentVideo]);

  const handleVideoSelect = useCallback((vid: IVideo) => {
    navigate(`/watch/${courseId}/${vid.id}`);
    setSidebarOpen(false);
  }, [courseId, navigate]);

  const currentIndex = useMemo(() => allVideos.findIndex((v) => v.id === videoId), [allVideos, videoId]);
  const nextVideo = allVideos[currentIndex + 1] ?? null;
  const prevVideo = allVideos[currentIndex - 1] ?? null;

  if (!course || !currentVideo) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <EmptyState
          icon={<Play />}
          englishMessage="Video not found"
          hindiMessage="वीडियो उपलब्ध नहीं"
          action={{ label: 'Back to Courses', onClick: () => navigate('/courses') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors min-h-[48px]"
        >
          <ArrowLeft size={18} />
          <span className="text-sm hidden sm:inline">Dashboard</span>
        </button>

        <BilingualLabel
          english={course.title}
          hindi=""
          englishSize="sm"
          englishWeight="semibold"
          hindiSize="xs"
          gap="tight"
          className="text-white/90 max-w-[200px] sm:max-w-xs truncate"
        />

        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="lg:hidden flex items-center gap-1.5 text-white/70 hover:text-white transition-colors min-h-[48px]"
        >
          <List size={20} />
        </button>
        <div className="hidden lg:block w-10" />
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Player area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Video placeholder */}
          <div className={clsx('relative w-full aspect-video flex items-center justify-center', ThumbnailGradientMap[course.thumbnailColour])}>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={36} className="text-white" />
                : <Play size={36} className="text-white ml-1" />}
            </button>

            {/* Quality pills */}
            <div className="absolute top-3 right-3 flex gap-1.5">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    quality === q ? 'bg-white text-navy' : 'bg-white/20 text-white hover:bg-white/30'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-navy px-4 py-3">
            {/* Scrubber */}
            <input
              type="range"
              min={0}
              max={currentVideo.durationSeconds}
              value={scrubValue}
              onChange={(e) => setScrubValue(Number(e.target.value))}
              className="w-full h-1.5 accent-brand cursor-pointer mb-2"
              aria-label="Video progress"
            />
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>{fmtDur(scrubValue)}</span>
              <span>{fmtDur(currentVideo.durationSeconds)}</span>
            </div>
          </div>

          {/* Video info */}
          <div className="px-4 py-4 border-t border-white/10">
            <h1 className="text-white font-semibold text-lg mb-1">{currentVideo.title}</h1>
            <p className="text-white/60 text-sm mb-4">{currentVideo.description}</p>

            {/* Prev / Next */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => prevVideo && handleVideoSelect(prevVideo)}
                disabled={!prevVideo}
                className="text-white/70 border-white/20 hover:bg-white/10"
              >
                ← Previous
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => nextVideo && handleVideoSelect(nextVideo)}
                disabled={!nextVideo}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — desktop always visible, mobile overlay */}
        <div className={clsx(
          'bg-[#12122a] border-l border-white/10 flex flex-col transition-all duration-300',
          'lg:w-80 lg:relative lg:translate-x-0',
          sidebarOpen
            ? 'fixed inset-y-0 right-0 w-80 z-50 translate-x-0'
            : 'fixed inset-y-0 right-0 w-80 z-50 translate-x-full lg:translate-x-0 lg:static'
        )}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <span className="text-white/80 text-sm font-medium">Course Content</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/50 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Overall progress */}
          <div className="px-4 py-3 border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/60 text-xs">Your progress</span>
              <span className="text-white/80 text-xs font-medium">{completedIds.size}/{course.totalVideos} videos</span>
            </div>
            <ProgressBar
              percentage={Math.round((completedIds.size / course.totalVideos) * 100)}
              className="[&>div]:bg-brand"
            />
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((mod) => {
              const isOpen = openModuleId === mod.id;
              const modCompleted = mod.videos.filter((v) => completedIds.has(v.id)).length;
              return (
                <div key={mod.id} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors min-h-[48px]"
                  >
                    <div className="text-left min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{mod.title}</p>
                      <p className="text-white/40 text-xs">{modCompleted}/{mod.videos.length} completed</p>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-white/40 shrink-0" /> : <ChevronDown size={16} className="text-white/40 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div>
                      {mod.videos.map((v) => {
                        const isActive = v.id === videoId;
                        const isDone = completedIds.has(v.id);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleVideoSelect(v)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors min-h-[48px]',
                              isActive ? 'bg-brand/20 border-l-2 border-brand' : 'hover:bg-white/5'
                            )}
                          >
                            {isDone
                              ? <CheckCircle size={16} className="text-green-400 shrink-0" />
                              : <Circle size={16} className={clsx('shrink-0', isActive ? 'text-brand' : 'text-white/30')} />}
                            <span className={clsx('text-sm truncate', isActive ? 'text-white font-medium' : 'text-white/60')}>
                              {v.title}
                            </span>
                            <span className="text-white/30 text-xs shrink-0 ml-auto">{fmtDur(v.durationSeconds)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

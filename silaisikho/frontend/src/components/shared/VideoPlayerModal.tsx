import { useState, useEffect } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui';
import type { IVideo, ICourse } from '@/types';

export interface VideoPlayerModalProps {
  video: IVideo;
  course: ICourse;
  isOpen: boolean;
  onClose: () => void;
  onEnrollClick: () => void;
}

type Quality = '360p' | '480p' | '720p';
const QUALITIES: Quality[] = ['360p', '480p', '720p'];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function VideoPlayerModal({
  video,
  course,
  isOpen,
  onClose,
  onEnrollClick,
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrubPosition] = useState<number>(0);
  const [selectedQuality, setSelectedQuality] = useState<Quality>('480p');

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Reset play state when video changes
  useEffect(() => {
    setIsPlaying(false);
  }, [video.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={clsx(
          'relative z-10 w-full h-full sm:h-auto sm:max-w-[800px]',
          'bg-[#1a1a1a] sm:rounded-2xl overflow-hidden flex flex-col'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-white/10">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-3">
            <h2 className="text-white text-[16px] font-medium leading-snug truncate">
              {video.title}
            </h2>
            <p className="text-warm-text text-[13px] truncate">{course.title}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Player area — 16:9 */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            {/* Play / Pause toggle */}
            <button
              onClick={() => setIsPlaying((v) => !v)}
              className={clsx(
                'w-[72px] h-[72px] rounded-full bg-brand flex items-center justify-center',
                'hover:scale-110 transition-transform duration-150 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black'
              )}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={30} className="text-white" />
                : <Play size={30} className="text-white ml-1" />
              }
            </button>

            {/* Duration pill — top right of player */}
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full">
              {formatDuration(video.durationSeconds)}
            </div>
          </div>
        </div>

        {/* Scrubber */}
        <div className="h-1 w-full bg-warm-border/30 mx-0">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${scrubPosition}%` }}
          />
        </div>

        {/* Quality selector */}
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-warm-text text-[11px] mr-1">Quality:</span>
          {QUALITIES.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={clsx(
                'min-h-[36px] px-3 rounded-full text-[12px] font-medium transition-colors duration-150',
                selectedQuality === q
                  ? 'bg-brand text-white'
                  : 'bg-muted text-warm-text hover:bg-warm-border'
              )}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Enroll banner */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#222222] border-t border-white/10">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-white text-[13px] font-medium">
              Unlock full course — पूरा कोर्स देखें
            </p>
            <p className="text-warm-text text-[12px] truncate">{course.title}</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onEnrollClick}
            className="shrink-0"
          >
            Enroll Now — अभी Join करें
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerModal;

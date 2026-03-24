import { memo } from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { Badge, Button, PriceDisplay, ProgressBar } from '@/components/ui';
import type { ICourse, CourseLevel } from '@/types';
import { ThumbnailGradientMap } from '@/types';
import { formatDuration } from '@/utils/format';

export interface CourseCardProps {
  course: ICourse;
  variant: 'catalog' | 'dashboard';
  progressPercentage?: number;
  onClick?: () => void;
}

const levelVariantMap: Record<CourseLevel, 'level-beginner' | 'level-intermediate' | 'level-advanced'> = {
  beginner:     'level-beginner',
  intermediate: 'level-intermediate',
  advanced:     'level-advanced',
};

const CourseCardComponent = ({
  course,
  variant,
  progressPercentage = 0,
  onClick,
}: CourseCardProps) => {
  const gradientClass = ThumbnailGradientMap[course.thumbnailColour];
  const duration = formatDuration(course.totalDurationSeconds);

  return (
    <div
      className={clsx(
        'bg-card rounded-2xl shadow-card hover:shadow-card-hover',
        'hover:-translate-y-0.5 transition-all duration-200',
        'cursor-pointer overflow-hidden w-full'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Course: ${course.title}`}
    >
      {/* Thumbnail */}
      <div className={clsx('relative h-[180px] rounded-t-2xl', gradientClass)}>
        {/* Duration pill — bottom left */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full">
          {duration}
        </div>
        {/* Level badge — bottom right */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant={levelVariantMap[course.level]}
            label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="bg-card rounded-b-2xl p-4 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-navy line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-warm-text text-[12px]">
          <span className="flex items-center gap-1">
            <PlayCircle size={14} />
            {course.totalModules} modules
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {duration}
          </span>
        </div>

        {/* Price */}
        <PriceDisplay
          price={course.discountedPrice ?? course.price}
          originalPrice={course.discountedPrice !== undefined ? course.price : undefined}
          size={variant === 'catalog' ? 'sm' : 'md'}
        />

        {/* Dashboard: progress + continue button */}
        {variant === 'dashboard' && (
          <>
            <ProgressBar
              percentage={progressPercentage}
              size="sm"
              showLabel
              labelPosition="right"
            />
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={onClick}
            >
              Continue — जारी करें
            </Button>
          </>
        )}

        {/* Catalog: details button */}
        {variant === 'catalog' && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={onClick}
          >
            Details देखें
          </Button>
        )}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders in lists
export const CourseCard = memo(CourseCardComponent);
export default CourseCard;

import { clsx } from 'clsx';

export interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  labelPosition?: 'right' | 'top';
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({
  percentage,
  showLabel = false,
  labelPosition = 'right',
  size = 'md',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const isComplete = clamped === 100;

  const trackHeight = size === 'sm' ? 'h-1' : 'h-1.5';
  const fillColour = isComplete ? 'bg-green-500' : 'bg-brand';
  const label = `${clamped}%`;

  const bar = (
    <div className={clsx('w-full bg-warm-border rounded-full overflow-hidden', trackHeight)}>
      <div
        className={clsx('h-full rounded-full transition-[width] duration-500 ease-out', fillColour)}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );

  if (!showLabel) return <div className={clsx('w-full', className)}>{bar}</div>;

  if (labelPosition === 'top') {
    return (
      <div className={clsx('w-full', className)}>
        <div className="flex justify-between mb-1">
          <span className="text-xs text-warm-text">Progress</span>
          <span className="text-xs text-warm-text font-medium">{label}</span>
        </div>
        {bar}
      </div>
    );
  }

  // right
  return (
    <div className={clsx('flex items-center gap-2 w-full', className)}>
      <div className="flex-1">{bar}</div>
      <span className="text-xs text-warm-text font-medium shrink-0">{label}</span>
    </div>
  );
}

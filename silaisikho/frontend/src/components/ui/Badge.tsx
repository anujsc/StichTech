import { clsx } from 'clsx';

export interface BadgeProps {
  variant:
    | 'level-beginner'
    | 'level-intermediate'
    | 'level-advanced'
    | 'status-published'
    | 'status-draft'
    | 'language-hindi'
    | 'language-english'
    | 'language-mixed'
    | 'count';
  label: string;
  className?: string;
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  'level-beginner':      'bg-green-100 text-green-800',
  'level-intermediate':  'bg-amber-100 text-amber-800',
  'level-advanced':      'bg-red-100 text-red-800',
  'status-published':    'bg-green-100 text-green-800',
  'status-draft':        'bg-amber-100 text-amber-800',
  'language-hindi':      'bg-blue-100 text-blue-800',
  'language-english':    'bg-purple-100 text-purple-800',
  'language-mixed':      'bg-indigo-100 text-indigo-800',
  'count':               'bg-navy/10 text-navy',
};

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}

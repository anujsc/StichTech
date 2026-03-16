import { clsx } from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  colour?: 'brand' | 'navy' | 'gold' | 'white';
  className?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

// Maps to CSS custom properties defined in index.css
const colourMap: Record<NonNullable<SpinnerProps['colour']>, string> = {
  brand: 'var(--color-brand)',
  navy:  'var(--color-navy)',
  gold:  'var(--color-gold)',
  white: '#FFFFFF',
};

export function Spinner({ size = 'md', colour = 'brand', className }: SpinnerProps) {
  const px = sizeMap[size];
  const stroke = colourMap[colour];
  const r = (px - 6) / 2; // radius accounting for strokeWidth 3 on each side
  const cx = px / 2;
  const cy = px / 2;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      className={clsx('animate-spin', className)}
      aria-label="Loading"
      role="status"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray="50"
        strokeDashoffset="25"
        strokeLinecap="round"
      />
    </svg>
  );
}

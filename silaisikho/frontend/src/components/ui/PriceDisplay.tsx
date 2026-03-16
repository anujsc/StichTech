import { clsx } from 'clsx';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { original: 'text-xs', current: 'text-sm font-semibold' },
  md: { original: 'text-sm', current: 'text-lg font-bold' },
  lg: { original: 'text-base', current: 'text-2xl font-bold' },
};

export function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const { original, current } = sizeMap[size];

  return (
    <div className={clsx('flex items-baseline gap-2', className)}>
      {originalPrice !== undefined && (
        <span className={clsx('line-through text-warm-text font-normal', original)}>
          ₹{originalPrice.toLocaleString('en-IN')}
        </span>
      )}
      <span className={clsx('text-gold', current)}>
        ₹{price.toLocaleString('en-IN')}
      </span>
    </div>
  );
}

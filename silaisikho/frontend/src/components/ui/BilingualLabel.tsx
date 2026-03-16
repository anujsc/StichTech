import { clsx } from 'clsx';

export interface BilingualLabelProps {
  english: string;
  hindi: string;
  englishSize?: 'sm' | 'base' | 'lg' | 'xl';
  hindiSize?: 'xs' | 'sm' | 'base';
  englishWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  gap?: 'none' | 'tight' | 'normal';
  className?: string;
}

const englishSizeMap: Record<NonNullable<BilingualLabelProps['englishSize']>, string> = {
  sm:   'text-sm',
  base: 'text-base',
  lg:   'text-lg',
  xl:   'text-xl',
};

const hindiSizeMap: Record<NonNullable<BilingualLabelProps['hindiSize']>, string> = {
  xs:   'text-xs',
  sm:   'text-sm',
  base: 'text-base',
};

const weightMap: Record<NonNullable<BilingualLabelProps['englishWeight']>, string> = {
  normal:   'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
};

const gapMap: Record<NonNullable<BilingualLabelProps['gap']>, string> = {
  none:   'space-y-0',
  tight:  'space-y-0.5',
  normal: 'space-y-1',
};

export function BilingualLabel({
  english,
  hindi,
  englishSize = 'base',
  hindiSize = 'xs',
  englishWeight = 'medium',
  gap = 'tight',
  className,
}: BilingualLabelProps) {
  return (
    <div className={clsx('flex flex-col', gapMap[gap], className)}>
      <span className={clsx('text-navy', englishSizeMap[englishSize], weightMap[englishWeight])}>
        {english}
      </span>
      <span className={clsx('text-warm-text', hindiSizeMap[hindiSize])}>
        {hindi}
      </span>
    </div>
  );
}

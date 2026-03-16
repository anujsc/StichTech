import { useState } from 'react';
import { clsx } from 'clsx';

export interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, { box: string; text: string }> = {
  xs: { box: 'w-6 h-6',   text: 'text-xs' },
  sm: { box: 'w-8 h-8',   text: 'text-sm' },
  md: { box: 'w-10 h-10', text: 'text-base' },
  lg: { box: 'w-12 h-12', text: 'text-lg' },
  xl: { box: 'w-16 h-16', text: 'text-xl' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return (parts[0].slice(0, 2)).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { box, text } = sizeMap[size];
  const initials = getInitials(name);
  const showImage = imageUrl && !imgError;

  return (
    <div
      className={clsx(
        'rounded-full overflow-hidden flex items-center justify-center shrink-0',
        box,
        !showImage && 'bg-navy',
        className
      )}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={clsx('text-white font-semibold select-none', text)}>
          {initials}
        </span>
      )}
    </div>
  );
}

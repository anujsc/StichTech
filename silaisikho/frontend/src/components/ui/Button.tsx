import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const LoadingSpinner = ({ colour }: { colour: string }) => (
  <svg
    className={clsx('animate-spin', colour)}
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="28"
      strokeDashoffset="10"
      strokeLinecap="round"
    />
  </svg>
);

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-brand text-white hover:bg-brand/90 focus:ring-2 focus:ring-brand focus:ring-offset-2',
  secondary:
    'bg-navy text-white hover:bg-navy/90 focus:ring-2 focus:ring-navy focus:ring-offset-2',
  outline:
    'bg-transparent border border-brand text-brand hover:bg-brand/10 focus:ring-2 focus:ring-brand focus:ring-offset-2',
  ghost:
    'bg-transparent text-warm-text hover:bg-muted focus:ring-2 focus:ring-warm-border focus:ring-offset-2',
};

const spinnerColour: Record<ButtonProps['variant'], string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-brand',
  ghost: 'text-warm-text',
};

const sizeClasses: Record<ButtonProps['size'], string> = {
  sm: 'px-3 text-sm min-h-[36px]',
  md: 'px-5 text-base min-h-[48px]',
  lg: 'px-7 text-lg min-h-[56px]',
};

export function Button({
  variant,
  size,
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-pill font-medium',
        'transition-all duration-200 active:scale-95',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      {loading && <LoadingSpinner colour={spinnerColour[variant]} />}
      {!loading && icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
    </button>
  );
}

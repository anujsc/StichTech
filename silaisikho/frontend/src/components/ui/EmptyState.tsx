import React from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  englishMessage: string;
  hindiMessage: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  englishMessage,
  hindiMessage,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="mb-4 p-4 rounded-full bg-muted text-warm-text">
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 40 })
          : icon}
      </div>
      <p className="text-base font-medium text-navy mb-1">{englishMessage}</p>
      <p className="text-sm text-warm-text mb-6">{hindiMessage}</p>
      {action && (
        <Button variant="outline" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

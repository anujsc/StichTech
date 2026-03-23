import { useState, useRef, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BilingualLabel } from './BilingualLabel';

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hindiLabel?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  showStrengthIndicator?: boolean;
  autoComplete?: 'current-password' | 'new-password';
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const PinInput = forwardRef<HTMLInputElement, PinInputProps>(
  (
    {
      value,
      onChange,
      label = 'PIN',
      hindiLabel = 'पिन',
      placeholder = '4 to 6 digit PIN',
      error,
      disabled = false,
      showStrengthIndicator = false,
      autoComplete = 'current-password',
      className = '',
      onKeyDown,
    },
    ref
  ) => {
    const [showPin, setShowPin] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter to only digits
    const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(filtered);
  };

  // Strength indicator logic
  const getStrengthColor = (length: number) => {
    if (length === 0) return 'bg-warm-border';
    if (length <= 3) return 'bg-brand';
    if (length === 4) return 'bg-amber-400';
    if (length === 5) return 'bg-amber-400';
    return 'bg-green-500';
  };

  const getStrengthLabel = (length: number) => {
    if (length === 0) return '';
    if (length <= 3) return { en: '4 digits minimum', hi: '4 अंक minimum' };
    if (length === 4) return { en: 'Acceptable', hi: 'ठीक है' };
    if (length === 5) return { en: 'Good', hi: 'अच्छा' };
    return { en: 'Strong', hi: 'मज़बूत' };
  };

  const strengthLabel = getStrengthLabel(value.length);

  return (
    <div className={className}>
      {/* Label Row */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-navy text-sm font-medium">
          <BilingualLabel
            english={label}
            hindi={hindiLabel}
            englishSize="sm"
            hindiSize="xs"
            gap="tight"
          />
        </label>
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="text-warm-text hover:text-navy transition-colors"
          aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
        >
          {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          ref={inputRef}
          type={showPin ? 'text' : 'password'}
          inputMode="numeric"
          maxLength={6}
          autoComplete={autoComplete}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={label}
          className={`w-full h-13 rounded-2xl border px-4 text-base text-navy bg-white transition-all outline-none placeholder:text-warm-text ${
            showPin ? '' : 'tracking-widest'
          } ${
            error
              ? 'border-brand ring-1 ring-brand'
              : 'border-warm-border focus:border-navy'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* Strength Indicator */}
      {showStrengthIndicator && value.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < value.length
                    ? getStrengthColor(value.length)
                    : 'bg-warm-border'
                }`}
              />
            ))}
          </div>
          {strengthLabel && (
            <p
              className={`text-xs mt-1.5 font-medium ${
                value.length <= 3
                  ? 'text-brand'
                  : value.length === 4
                    ? 'text-amber-500'
                    : value.length === 5
                      ? 'text-amber-500'
                      : 'text-green-500'
              }`}
            >
              {strengthLabel.en} — {strengthLabel.hi}
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-brand text-xs">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
);

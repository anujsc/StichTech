import { Mail, Phone, AlertCircle } from 'lucide-react';
import { BilingualLabel } from './BilingualLabel';

export interface IdentifierInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function IdentifierInput({
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
  className = '',
  onKeyDown,
}: IdentifierInputProps) {
  // Detect if input is mobile number or email
  const isMobileNumber = /^\d{6,}$/.test(value);
  const isEmail = value.includes('@');
  const inputType = isMobileNumber ? 'tel' : 'email';
  const inputMode = isMobileNumber ? 'tel' : 'email';

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-navy text-sm font-medium mb-1.5">
        <BilingualLabel
          english="Email or Mobile Number"
          hindi="ईमेल या मोबाइल नंबर"
          englishSize="sm"
          hindiSize="xs"
          gap="tight"
        />
      </label>

      {/* Input */}
      <input
        type={inputType}
        inputMode={inputMode}
        autoComplete="username"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder="priya@gmail.com या 9876543210"
        aria-label="Email or mobile number"
        className={`w-full h-13 rounded-2xl border px-4 text-base text-navy bg-white transition-all outline-none placeholder:text-warm-text ${
          error
            ? 'border-brand ring-1 ring-brand'
            : 'border-warm-border focus:border-navy'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      />

      {/* Detection Badge */}
      {value.length > 3 && (
        <div className="mt-2 animate-in fade-in duration-200">
          {isMobileNumber ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200">
              <Phone size={14} className="text-teal-600" />
              <span className="text-xs text-teal-700 font-medium">
                Mobile Number — मोबाइल नंबर
              </span>
            </div>
          ) : isEmail ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
              <Mail size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">
                Email — ईमेल
              </span>
            </div>
          ) : null}
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

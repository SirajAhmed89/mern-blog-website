import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-10 px-4 border rounded-md transition-all duration-300 
            ${error 
              ? 'border-error-500 focus:ring-error-500' 
              : 'border-neutral-300 focus:ring-primary-500'
            } 
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-error-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

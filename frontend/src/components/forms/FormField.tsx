import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className = '', required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
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

FormField.displayName = 'FormField';

export default FormField;

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className, ...props }, ref) => {
    const getInputClasses = () => {
      let classes = 'input-field';
      if (icon) classes += ' input-with-icon';
      if (error) classes += ' input-error';
      if (className) classes += ` ${className}`;
      return classes;
    };

    const containerClasses = fullWidth ? 'input-container input-full-width' : 'input-container';

    return (
      <div className={containerClasses}>
        {label && (
          <label className="input-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {icon && (
            <div className="input-icon">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={getInputClasses()}
            {...props}
          />
        </div>
        {error && (
          <p className="input-error-message">
            <svg className="input-error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
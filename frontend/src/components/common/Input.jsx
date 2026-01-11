import { forwardRef } from "react";

/**
 * Reusable Input component
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      helperText,
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-secondary-400">{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            className={`
            w-full px-4 py-2 border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-secondary-100 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-secondary-300 hover:border-secondary-400"
            }
          `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-secondary-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Textarea component
 */
export const Textarea = forwardRef(
  (
    {
      label,
      error,
      placeholder,
      helperText,
      required = false,
      disabled = false,
      rows = 4,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={`
          w-full px-4 py-2 border rounded-lg resize-none
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-secondary-100 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-secondary-300 hover:border-secondary-400"
          }
        `}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * Select component
 */
export const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "Sélectionnez...",
      required = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          disabled={disabled}
          className={`
          w-full px-4 py-2 border rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-secondary-100 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-secondary-300 hover:border-secondary-400"
          }
        `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Input;

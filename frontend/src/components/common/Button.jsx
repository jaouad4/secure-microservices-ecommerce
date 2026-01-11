import { forwardRef } from "react";
import { ButtonLoader } from "./Loading";

/**
 * Reusable Button component
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      type = "button",
      className = "",
      leftIcon,
      rightIcon,
      onClick,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
      secondary:
        "bg-secondary-200 hover:bg-secondary-300 text-secondary-800 focus:ring-secondary-400",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      outline:
        "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
      ghost:
        "text-secondary-600 hover:bg-secondary-100 focus:ring-secondary-400",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
        {...props}
      >
        {loading && <ButtonLoader />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

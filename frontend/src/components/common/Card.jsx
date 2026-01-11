/**
 * Reusable Card component
 */
const Card = ({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-md
        ${
          hover
            ? "hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            : ""
        }
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-secondary-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-secondary-900 ${className}`}>
    {children}
  </h3>
);

/**
 * Card Content component
 */
export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = "" }) => (
  <div className={`border-t border-secondary-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;

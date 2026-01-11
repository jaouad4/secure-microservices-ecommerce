import { FiLoader } from "react-icons/fi";

/**
 * Loading component with spinner
 */
const Loading = ({ message = "Chargement...", fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="spinner"></div>
      <p className="text-secondary-600 text-lg">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
};

/**
 * Inline loading spinner
 */
export const InlineLoader = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <FiLoader className={`animate-spin ${sizes[size]} text-primary-600`} />
  );
};

/**
 * Button loading state
 */
export const ButtonLoader = () => (
  <FiLoader className="animate-spin w-5 h-5 mr-2" />
);

export default Loading;

import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import Button from "./Button";

/**
 * Empty state component
 */
const EmptyState = ({
  icon: Icon = FiAlertCircle,
  title = "Aucun élément",
  description = "Il n'y a rien à afficher pour le moment.",
  action,
  actionLabel = "Rafraîchir",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="text-lg font-medium text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action} variant="outline" leftIcon={<FiRefreshCw />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

/**
 * Error state component
 */
export const ErrorState = ({
  title = "Une erreur est survenue",
  description = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <FiAlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-500 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" leftIcon={<FiRefreshCw />}>
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

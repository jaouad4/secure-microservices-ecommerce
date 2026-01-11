import { Fragment } from "react";
import { FiX } from "react-icons/fi";
import Button from "./Button";

/**
 * Modal component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  footer,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div
          className={`
            bg-white rounded-xl shadow-xl w-full ${sizes[size]}
            transform transition-all duration-300 animate-fadeIn
            max-h-[90vh] flex flex-col
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-secondary-500" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

/**
 * Confirmation Modal
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-secondary-600">{message}</p>
    </Modal>
  );
};

export default Modal;

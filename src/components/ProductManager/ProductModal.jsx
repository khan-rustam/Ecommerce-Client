import React from 'react';
import { X } from 'lucide-react';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {Function} onClose - Function to close the modal
 * @property {Function} onConfirm - Function to confirm the action
 * @property {string} title - Modal title
 * @property {string} message - Modal message
 * @property {string} [confirmButtonText] - Text for the confirm button
 * @property {boolean} [confirmButtonDisabled] - Whether the confirm button is disabled
 * @property {string} [confirmButtonColor] - Color of the confirm button (red, blue, green)
 */

/**
 * Modal component for product-related confirmations
 * @param {ModalProps} props - Component props
 * @returns {React.ReactElement|null}
 */
const ProductModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmButtonText = "Confirm",
  confirmButtonDisabled = false,
  confirmButtonColor = "blue"
}) => {
  if (!isOpen) return null;

  // Determine button color classes based on confirmButtonColor prop
  const getButtonColorClasses = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'blue':
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  const buttonColorClasses = getButtonColorClasses();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${buttonColorClasses} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onConfirm}
              disabled={confirmButtonDisabled}
            >
              {confirmButtonText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={confirmButtonDisabled}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 
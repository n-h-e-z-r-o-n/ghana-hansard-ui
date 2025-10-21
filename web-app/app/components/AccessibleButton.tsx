'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  tooltip?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  children: React.ReactNode;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    success = false,
    error = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    tooltip,
    ariaLabel,
    ariaDescribedBy,
    children,
    className = '',
    disabled,
    onClick,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Combine refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(buttonRef.current);
        } else {
          ref.current = buttonRef.current;
        }
      }
    }, [ref]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled && !loading && onClick) {
          onClick(e as any);
        }
      }
    };

    // Handle focus management
    const handleFocus = () => {
      setIsFocused(true);
      if (tooltip) {
        setShowTooltip(true);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      setShowTooltip(false);
    };

    // Handle mouse events for tooltip
    const handleMouseEnter = () => {
      if (tooltip) {
        setShowTooltip(true);
      }
    };

    const handleMouseLeave = () => {
      if (!isFocused) {
        setShowTooltip(false);
      }
    };

    // Variant styles
    const getVariantStyles = () => {
      const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
      
      switch (variant) {
        case 'primary':
          return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500`;
        case 'secondary':
          return `${baseStyles} bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400`;
        case 'danger':
          return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300 disabled:text-gray-500`;
        case 'success':
          return `${baseStyles} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300 disabled:text-gray-500`;
        case 'warning':
          return `${baseStyles} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-gray-300 disabled:text-gray-500`;
        case 'ghost':
          return `${baseStyles} text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400`;
        default:
          return baseStyles;
      }
    };

    // Size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm';
        case 'md':
          return 'px-4 py-2 text-sm';
        case 'lg':
          return 'px-6 py-3 text-base';
        default:
          return 'px-4 py-2 text-sm';
      }
    };

    // Get status icon
    const getStatusIcon = () => {
      if (loading) {
        return <ArrowPathIcon className="animate-spin" />;
      }
      if (success) {
        return <CheckIcon className="text-green-600" />;
      }
      if (error) {
        return <ExclamationTriangleIcon className="text-red-600" />;
      }
      return null;
    };

    const statusIcon = getStatusIcon();
    const isDisabled = disabled || loading;

    return (
      <div className="relative">
        <motion.button
          ref={buttonRef}
          type="button"
          className={`
            ${getVariantStyles()}
            ${getSizeStyles()}
            ${fullWidth ? 'w-full' : ''}
            ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            rounded-lg
            flex items-center justify-center space-x-2
            ${className}
          `}
          disabled={isDisabled}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
          aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
          aria-describedby={ariaDescribedBy}
          aria-disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              {icon}
            </motion.div>
          )}

          {/* Status Icon */}
          {statusIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              {statusIcon}
            </motion.div>
          )}

          {/* Button Text */}
          <motion.span
            initial={{ opacity: loading ? 0.5 : 1 }}
            animate={{ opacity: loading ? 0.5 : 1 }}
            className="flex-1"
          >
            {children}
          </motion.span>

          {/* Right Icon */}
          {icon && iconPosition === 'right' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              {icon}
            </motion.div>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && tooltip && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
              role="tooltip"
              aria-hidden="false"
            >
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen reader only text for status */}
        {loading && (
          <span className="sr-only">Loading, please wait</span>
        )}
        {success && (
          <span className="sr-only">Success</span>
        )}
        {error && (
          <span className="sr-only">Error occurred</span>
        )}
      </div>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;

// Accessible form field component
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AccessibleFormField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  children
}: AccessibleFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={id}
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${isFocused || hasValue
            ? 'top-2 text-xs text-gray-600'
            : 'top-3 text-sm text-gray-500'
          }
          ${error ? 'text-red-600' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={isFocused ? placeholder : ''}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        aria-describedby={`${id}-helper ${id}-error`}
        className={`
          w-full px-3 pt-6 pb-2 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
          }
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
        `}
      />

      {/* Helper Text */}
      {helperText && !error && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 flex items-center space-x-1"
        >
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        </motion.div>
      )}

      {/* Custom children (like icons, buttons) */}
      {children && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {children}
        </div>
      )}
    </div>
  );
}

// Accessible modal component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative bg-white rounded-lg shadow-xl w-full ${getSizeClasses()} ${className}`}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

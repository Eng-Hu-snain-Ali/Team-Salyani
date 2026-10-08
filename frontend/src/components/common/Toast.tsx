import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-portal-container" aria-live="polite">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} className="toast-icon success" />;
            case 'error':
              return <AlertCircle size={18} className="toast-icon error" />;
            default:
              return <Info size={18} className="toast-icon info" />;
          }
        };

        return (
          <div key={toast.id} className={`toast-bubble ${toast.type}`}>
            {getIcon()}
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

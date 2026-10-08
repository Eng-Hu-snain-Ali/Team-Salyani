import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle2 size={18} color="var(--color-success)" />;
            case 'error':
              return <XCircle size={18} color="var(--color-danger)" />;
            case 'warning':
              return <AlertTriangle size={18} color="var(--color-warning)" />;
            default:
              return <Info size={18} color="var(--color-primary)" />;
          }
        };

        return (
          <div key={t.id} className={`toast-item ${t.type}`} role="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getIcon()}
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              style={{ color: 'var(--text-muted)', display: 'flex' }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        className={cn(
          'relative z-50 w-full max-w-md',
          'bg-white rounded-lg shadow-xl',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="p-6 space-y-4">
          {/* Icon */}
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100">
              {icon}
            </div>
          )}

          {/* Title */}
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-gray-900 text-center"
          >
            {title}
          </h2>

          {/* Description */}
          <p
            id="confirm-dialog-description"
            className="text-sm text-gray-600 leading-relaxed text-center"
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className="flex-1 min-w-[80px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

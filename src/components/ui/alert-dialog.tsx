import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'OK',
}: AlertDialogProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="p-6 space-y-4">
          <h2
            id="alert-dialog-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>
          <p
            id="alert-dialog-description"
            className="text-sm text-gray-600 leading-relaxed"
          >
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button onClick={() => onOpenChange(false)} className="min-w-[80px]">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

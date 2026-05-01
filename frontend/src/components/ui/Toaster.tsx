import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'rounded-lg shadow-lg border',
          title: 'font-semibold text-sm',
          description: 'text-sm',
          actionButton: 'bg-primary-500 text-white hover:bg-primary-600 rounded-md px-3 py-1.5 text-sm font-medium',
          cancelButton: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-md px-3 py-1.5 text-sm font-medium',
          closeButton: 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700',
          success: 'bg-white border-success-200 text-success-900',
          error: 'bg-white border-error-200 text-error-900',
          warning: 'bg-white border-warning-200 text-warning-900',
          info: 'bg-white border-info-200 text-info-900',
        },
      }}
    />
  );
}

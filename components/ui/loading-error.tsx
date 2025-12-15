import { AlertCircle, Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  message?: string;
  type?: 'page' | 'component' | 'inline';
}

export function LoadingSkeleton({ message = 'Loading...', type = 'component' }: LoadingSkeletonProps) {
  if (type === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-black" />
          <p className="font-serif text-lg tracking-wider">{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="inline-flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-black" />
        <p className="font-serif text-lg tracking-wider">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  error: string | Error;
  onRetry?: () => void;
  type?: 'page' | 'component' | 'inline' | 'banner';
  details?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  type = 'component',
  details
}: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : error;

  if (type === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="font-serif text-2xl tracking-wider mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          {details && <p className="text-gray-500 text-sm mb-6">{details}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-black text-white font-serif tracking-wider hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-900 font-medium">{message}</p>
            {details && <p className="text-red-800 text-sm mt-1">{details}</p>}
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-red-50 p-6 mb-6">
      <div className="flex gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-red-700">{message}</p>
          {details && <p className="text-red-600 text-sm mt-2">{details}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-red-600 hover:text-red-800 font-medium underline text-sm"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FormErrorProps {
  error?: string;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return <p className="text-red-500 text-sm mt-1">{error}</p>;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="font-serif text-xl tracking-wider mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-black text-white font-serif tracking-wider hover:bg-gray-800 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export const isProduction = process.env.NODE_ENV === 'production';

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return `http://localhost:${process.env.PORT || 3000}`;
}

export function getApiUrl(path: string) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

// Safe localStorage wrapper for SSR
export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Error reporting utility
export function reportError(error: Error, context?: string): void {
  if (isProduction) {
    // In production, log to external service (e.g., Sentry)
    console.error(`[${context || 'Error'}]:`, error.message);
  } else {
    // In development, log full error details
    console.error(`[${context || 'Error'}]:`, error);
  }
}


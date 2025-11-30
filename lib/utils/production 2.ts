// Production utilities
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Safe console logging for production
export const safeConsole = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
};

// Error reporting for production
export const reportError = (error: Error, context?: string) => {
  if (isProduction) {
    // In production, you might want to send to error reporting service
    console.error(`Production Error ${context ? `[${context}]` : ''}:`, error);
  } else {
    console.error(`Development Error ${context ? `[${context}]` : ''}:`, error);
  }
};

// Safe localStorage operations
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      reportError(error as Error, `localStorage.getItem(${key})`);
    }
    return null;
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      reportError(error as Error, `localStorage.setItem(${key})`);
    }
    return false;
  },
  
  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      reportError(error as Error, `localStorage.removeItem(${key})`);
    }
    return false;
  },
};
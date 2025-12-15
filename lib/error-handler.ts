// Centralized error handling and user feedback system

export interface ApiError {
  status: number;
  message: string;
  details?: string;
  code?: string;
}

export interface ErrorResponse<T = null> {
  success: false;
  error: string;
  details?: string;
  data?: T;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Parse API error response with proper type safety
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  const status = response.status;
  
  try {
    const data = await response.json();
    return {
      status,
      message: data.error || data.message || `Error: ${status}`,
      details: data.details || data.hint,
      code: data.code
    };
  } catch {
    return {
      status,
      message: `HTTP ${status}: ${response.statusText}`,
    };
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiError | Error): string {
  if (error instanceof ApiError || 'status' in error) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
      case 400:
        return 'Invalid request. Please check your information.';
      case 401:
        return 'Please sign in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested item was not found.';
      case 409:
        return 'This item already exists.';
      case 422:
        return 'The information provided is invalid. Please review and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again shortly.';
      default:
        return apiError.message || 'An unexpected error occurred.';
    }
  }
  
  return error.message || 'An unexpected error occurred.';
}

/**
 * Log error for debugging (only in development)
 */
export function logError(context: string, error: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
}

/**
 * Retry logic for failed API calls
 */
export async function retryRequest<T>(
  fetchFn: () => Promise<Response>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchFn();
      
      if (response.ok) {
        return await response.json();
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        const error = await parseApiError(response);
        throw new Error(error.message);
      }
      
      // Retry on server errors (5xx)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }
      
      const error = await parseApiError(response);
      throw new Error(error.message);
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries && !(error instanceof Error && error.message.includes('Invalid'))) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }
    }
  }
  
  throw lastError || new Error('Request failed after multiple retries');
}

/**
 * Validate required fields in form data
 */
export function validateFormData(data: Record<string, any>, requiredFields: string[]): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Handle async operations with proper error management
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorContext: string = 'Operation'
): Promise<[T | null, Error | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    logError(errorContext, error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Extract user-friendly error message from API error response
 */
export function extractErrorMessage(error: any): string {
  // Check if error has response data with message (backend format)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check if error has response data with errors array (validation errors)
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const firstError = error.response.data.errors[0];
    if (firstError?.message) {
      return firstError.message;
    }
  }

  // Check for axios error message
  if (error.message) {
    // Don't show generic axios messages
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your connection — नेटवर्क error। कनेक्शन चेक करें';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again — समय समाप्त। दोबारा try करें';
    }
    // If it's not a generic message, return it
    if (!error.message.includes('Request failed with status code')) {
      return error.message;
    }
  }

  // Check status code for generic messages
  const status = error.response?.status;
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input — गलत request। input चेक करें';
    case 401:
      return 'Invalid credentials. Please try again — गलत जानकारी। दोबारा try करें';
    case 403:
      return 'Access denied — access नहीं है';
    case 404:
      return 'Not found — नहीं मिला';
    case 409:
      return 'Already exists — पहले से मौजूद है';
    case 429:
      return 'Too many attempts. Please try again later — बहुत बार try किया। बाद में try करें';
    case 500:
      return 'Server error. Please try again — server error। दोबारा try करें';
    default:
      return 'Something went wrong. Please try again — कुछ गलत हो गया। दोबारा try करें';
  }
}

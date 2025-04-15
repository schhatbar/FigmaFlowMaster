/**
 * Handles errors and returns appropriate error messages
 * @param error The error to handle
 * @returns A user-friendly error message
 */
export function handleError(error: any): string {
  console.error('Error occurred:', error);
  
  // Check error type
  if (error instanceof Error) {
    const errorMessage = error.message;
    
    // Handle specific error types
    if (errorMessage.includes('Invalid SVG')) {
      return 'The SVG file is invalid or corrupted. Please check the file and try again.';
    }
    
    if (errorMessage.includes('Missing root SVG element')) {
      return 'The file does not appear to be a valid SVG. Please check the file format.';
    }
    
    if (errorMessage.includes('permission')) {
      return 'The plugin does not have permission to perform this action. Please try again.';
    }
    
    if (errorMessage.includes('Font')) {
      return 'There was an issue with loading fonts. Please try again.';
    }
    
    // Return the original error message if it's specific
    return `Error: ${errorMessage}`;
  }
  
  // For SVG parsing errors
  if (typeof error === 'object' && error !== null) {
    if ('message' in error) {
      if (typeof error.message === 'string' && error.message.includes('SVG')) {
        return `SVG parsing error: ${error.message}`;
      }
      
      return `Error: ${error.message}`;
    }
  }
  
  // Generic error message
  return 'An unexpected error occurred. Please try again or try with a different SVG file.';
}

/**
 * Log error with details to the console for debugging
 * @param context The context where the error occurred
 * @param error The error object
 */
export function logError(context: string, error: any): void {
  console.error(`Error in ${context}:`, error);
  
  // Additional logging for debugging
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack);
  }
}

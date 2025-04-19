import axios from 'axios';
import { ErrorDetails } from '../types/index.js';

/**
 * Creates a standardized error object from Axios errors
 */
export function handleAxiosError(error: any): ErrorDetails {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data?.message || error.message,
      code: error.response.data?.code
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 503,
      message: 'No response from server',
      code: 'SERVICE_UNAVAILABLE'
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 500,
      message: error.message,
      code: 'CLIENT_ERROR'
    };
  }
}

/**
 * Determines if a network request should be retried
 */
export function shouldRetry(status: number): boolean {
  // Retry on connection errors or 5xx server errors except 501 Not Implemented
  return status === 0 || (status >= 500 && status !== 501);
}

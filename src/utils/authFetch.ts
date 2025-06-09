import { store } from '../store';
import { API_URL } from '../config';

// Helper function to get the auth token
const getAuthToken = (): string | null => {
  return store.getState().user.token;
};

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
  body?: any; // Allow any type for the body
}

// Generic function for making authenticated fetch requests
const authFetch = async (url: string, options: RequestOptions = {}): Promise<any> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Handle request body for methods other than GET and HEAD
  if (options.body !== undefined && options.method !== 'GET' && options.method !== 'HEAD') {
      // If the body is already a FormData instance (for file uploads), don't stringify
      if (!(options.body instanceof FormData)) {
          config.body = JSON.stringify(options.body);
      } else {
          // For FormData, remove the Content-Type header as fetch sets it automatically
          delete (config.headers as any)['Content-Type'];
      }
  }

  try {
    const response = await fetch(`${API_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const error = new Error(errorData.message || 'Something went wrong');
      // Attach response data and status to the error object
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    // Handle cases where the response might be empty (e.g., DELETE)
    if (response.status === 204) {
        return null; // No content
    }

    // Attempt to parse JSON, but allow for non-JSON responses
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (jsonError) {
        // If JSON parsing fails, return the raw text
        return text;
    }

  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Helper functions for specific HTTP methods

const get = (url: string, options?: RequestOptions) => authFetch(url, { method: 'GET', ...options });
const post = (url: string, body: any, options?: RequestOptions) => authFetch(url, { method: 'POST', body, ...options });
const put = (url: string, body: any, options?: RequestOptions) => authFetch(url, { method: 'PUT', body, ...options });
const del = (url: string, options?: RequestOptions) => authFetch(url, { method: 'DELETE', ...options });
const patch = (url: string, body: any, options?: RequestOptions) => authFetch(url, { method: 'PATCH', body, ...options });

export { get, post, put, del, patch, authFetch }; 
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ─── Token Store ──────────────────────────────────────────────────────────────
// Module-level variable that AuthContext writes to and interceptors read from.
// The access token lives in memory only, never in localStorage.

export const tokenStore = {
  accessToken: null as string | null,
  setToken(token: string | null): void {
    this.accessToken = token;
  },
  getToken(): string | null {
    return this.accessToken;
  },
};

// ─── Axios Instance ───────────────────────────────────────────────────────────

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the Bearer token to every request.

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401 responses by attempting a token refresh and retrying the request.
// Concurrent refresh attempts are serialized using isRefreshing and refreshPromise.

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Don't retry if this is the refresh endpoint itself (prevent infinite loop)
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Don't retry on login or register endpoints - these are intentional 401s
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // Check if this is a 401 that should trigger a refresh
    const should401Refresh =
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry;

    if (!should401Refresh) {
      return Promise.reject(error);
    }

    // Mark this request as retried to prevent infinite loops
    originalRequest._retry = true;

    // If a refresh is already in progress, wait for it
    if (isRefreshing && refreshPromise) {
      return refreshPromise.then((newToken) => {
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    // Start a new refresh attempt
    isRefreshing = true;
    refreshPromise = new Promise<string | null>(async (resolve, reject) => {
      try {
        // Use a separate axios instance for the refresh call to avoid circular interceptor logic
        const refreshAxios = axios.create({
          baseURL: import.meta.env.VITE_API_URL as string,
          withCredentials: true,
        });

        const response = await refreshAxios.post('/auth/refresh');
        const newToken = response.data.data?.accessToken;

        if (newToken) {
          tokenStore.setToken(newToken);
          resolve(newToken);
        } else {
          tokenStore.setToken(null);
          reject(new Error('No access token in refresh response'));
        }
      } catch (refreshError) {
        tokenStore.setToken(null);
        reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    });

    try {
      const newToken = await refreshPromise;
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed — set session expired flag and redirect to login
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.setItem('silaisikho-session-expired', 'true');
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;

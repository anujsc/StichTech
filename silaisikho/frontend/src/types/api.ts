// ─── BackendUser ──────────────────────────────────────────────────────────────
// Matches the sanitizeUser output from the backend

export interface BackendUser {
  id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  profilePicUrl?: string;
  role: 'student' | 'admin';
  authProvider: 'local';
}

// ─── AuthResponse ─────────────────────────────────────────────────────────────
// Returned by register and login endpoints in the data field

export interface AuthResponse {
  user: BackendUser;
  accessToken: string;
  expiresIn: number;
}

// ─── RefreshResponse ──────────────────────────────────────────────────────────
// Returned by refresh endpoint in the data field

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

// ─── BackendResponse ──────────────────────────────────────────────────────────
// Generic response wrapper matching sendSuccess and sendError shape

export interface BackendResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

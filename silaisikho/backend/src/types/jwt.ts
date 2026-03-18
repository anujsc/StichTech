// ─── JWT Payload Types ────────────────────────────────────────────────────────

export interface JwtAccessPayload {
  userId: string;
  identifier: string;
  identifierType: 'email' | 'mobile';
  role: 'student' | 'admin';
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

// ─── Auth Tokens Response ─────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // access token expiry in seconds
}

// ─── Verification Result — discriminated union on success ─────────────────────

export type TokenVerificationResult =
  | { success: true; payload: JwtAccessPayload }
  | { success: false; error: string };

import type { Response } from 'express';

// ─── ApiSuccessResponse ────────────────────────────────────────────────────────
// Standardised success response shape for all API endpoints.

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}

// ─── ApiErrorResponse ──────────────────────────────────────────────────────────
// Standardised error response shape for all API endpoints.

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// ─── ApiResponse ──────────────────────────────────────────────────────────────
// Union type representing any API response.

export type ApiResponse = ApiSuccessResponse<unknown> | ApiErrorResponse;

// ─── sendSuccess ──────────────────────────────────────────────────────────────
// Helper to send a standardised success response.

export function sendSuccess<T>(
  res: Response,
  data: T | undefined,
  message: string = 'Success',
  statusCode: number = 200,
  meta: ApiSuccessResponse<T>['meta'] = undefined
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };

  res.status(statusCode).json(response);
}

// ─── sendError ────────────────────────────────────────────────────────────────
// Helper to send a standardised error response.

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: ApiErrorResponse['errors'] = undefined
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(response);
}

// ─── sendPaginatedSuccess ─────────────────────────────────────────────────────
// Helper to send a paginated success response.

export function sendPaginatedSuccess<T>(
  res: Response,
  data: T[],
  message: string,
  total: number,
  page: number,
  limit: number
): void {
  const hasNextPage = page * limit < total;

  sendSuccess(res, data, message, 200, {
    page,
    limit,
    total,
    hasNextPage,
  });
}

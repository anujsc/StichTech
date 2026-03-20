import axiosInstance from './axiosInstance';
import type { BackendUser, AuthResponse, RefreshResponse, BackendResponse } from '@/types/api';

// ─── registerUser ─────────────────────────────────────────────────────────────

export async function registerUser(params: {
  name: string;
  identifier: string;
  pin: string;
}): Promise<BackendResponse<AuthResponse>> {
  const response = await axiosInstance.post('/auth/register', params);
  return response.data as BackendResponse<AuthResponse>;
}

// ─── loginUser ────────────────────────────────────────────────────────────────

export async function loginUser(params: {
  identifier: string;
  pin: string;
}): Promise<BackendResponse<AuthResponse>> {
  const response = await axiosInstance.post('/auth/login', params);
  return response.data as BackendResponse<AuthResponse>;
}

// ─── logoutUser ───────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  await axiosInstance.post('/auth/logout');
}

// ─── refreshTokens ────────────────────────────────────────────────────────────
// Called by the response interceptor and startup effect.
// Uses a separate axios instance to avoid circular interceptor logic.

export async function refreshTokens(): Promise<BackendResponse<RefreshResponse>> {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data as BackendResponse<RefreshResponse>;
}

// ─── getMyProfile ─────────────────────────────────────────────────────────────

export async function getMyProfile(): Promise<BackendResponse<BackendUser>> {
  const response = await axiosInstance.get('/users/profile');
  return response.data as BackendResponse<BackendUser>;
}

// ─── updateMyProfile ──────────────────────────────────────────────────────────

export async function updateMyProfile(params: {
  name?: string;
  profilePicUrl?: string;
}): Promise<BackendResponse<BackendUser>> {
  const response = await axiosInstance.patch('/users/profile', params);
  return response.data as BackendResponse<BackendUser>;
}

// ─── changeMyPin ──────────────────────────────────────────────────────────────

export async function changeMyPin(params: {
  currentPin: string;
  newPin: string;
  confirmPin: string;
}): Promise<BackendResponse<AuthResponse>> {
  const response = await axiosInstance.patch('/users/change-pin', params);
  return response.data as BackendResponse<AuthResponse>;
}

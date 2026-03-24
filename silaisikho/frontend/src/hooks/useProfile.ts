import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/shared/ToastProvider';
import { getMyProfile, updateMyProfile } from '@/api/authApi';
import type { BackendUser } from '@/types/api';
import { extractErrorMessage } from '@/utils/apiError';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateProfileParams {
  name?: string;
  profilePicUrl?: string;
}

// ─── useProfile Hook ──────────────────────────────────────────────────────────

export function useProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // ─── refreshProfile ───────────────────────────────────────────────────────
  // Silent background refresh of profile data

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const response = await getMyProfile();
      if (response.success && response.data) {
        updateCurrentUser(response.data.user as Partial<BackendUser>);
      }
    } catch (error) {
      // Silent failure - don't surface errors for background refresh
    }
  }, [updateCurrentUser]);

  // ─── updateProfile ────────────────────────────────────────────────────────
  // Update profile with loading, error, and success states

  const updateProfile = useCallback(async (params: UpdateProfileParams): Promise<void> => {
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const response = await updateMyProfile(params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }

      if (response.data) {
        updateCurrentUser(response.data.user as Partial<BackendUser>);
      }

      setUpdateSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      showToast('Profile updated successfully! — प्रोफ़ाइल अपडेट हो गई', 'success');
    } catch (error: any) {
      const errorMsg = extractErrorMessage(error);
      setUpdateError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsUpdating(false);
    }
  }, [updateCurrentUser, showToast]);

  return {
    currentUser,
    isUpdating,
    updateError,
    updateSuccess,
    updateProfile,
    refreshProfile,
  };
}

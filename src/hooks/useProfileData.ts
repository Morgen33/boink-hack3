
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFetch } from './useProfileFetch';
import { useProfileSave } from './useProfileSave';
import { useProfileComplete } from './useProfileComplete';
import { convertProfileToFormData } from '@/utils/profileDataUtils';

export const useProfileData = () => {
  const { user, loading: authLoading, isNewUser } = useAuth();
  const { profile, loading, setProfile } = useProfileFetch();
  const { handleProfileSave: saveProfile } = useProfileSave();
  const { handleProfileComplete, profileJustCompleted } = useProfileComplete();

  // Removed the automatic redirect to /auth - this should be handled by individual pages

  const handleProfileSave = async (formData: any, isPartial: boolean = false) => {
    const updateData = await saveProfile(formData, isPartial);
    // Update local profile data
    setProfile(prev => prev ? { ...prev, ...updateData } : null);
  };

  return {
    user,
    profile,
    loading: authLoading || loading,
    profileJustCompleted,
    isNewUser,
    handleProfileSave,
    handleProfileComplete,
    convertProfileToFormData,
  };
};


import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFetch } from './useProfileFetch';
import { useProfileSave } from './useProfileSave';
import { useProfileComplete } from './useProfileComplete';
import { convertProfileToFormData } from '@/utils/profileDataUtils';

export const useProfileData = () => {
  const { user, loading: authLoading, isNewUser } = useAuth();
  const { profile, loading, setProfile, refreshProfile } = useProfileFetch();
  const { handleProfileSave: saveProfile } = useProfileSave();
  const { handleProfileComplete, profileJustCompleted } = useProfileComplete();

  const handleProfileSave = async (formData: any, isPartial: boolean = false) => {
    const updateData = await saveProfile(formData, isPartial);
    // Update local profile data and refresh from database
    setProfile(prev => prev ? { ...prev, ...updateData } : null);
    
    // If this was a completion (not partial), refresh from database to ensure we have latest data
    if (!isPartial) {
      setTimeout(async () => {
        try {
          await refreshProfile();
        } catch (error) {
          console.error('Error refreshing profile after completion:', error);
        }
      }, 500);
    }
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
    refreshProfile,
  };
};


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
    
    // Force a complete refresh from database after any save
    setTimeout(async () => {
      try {
        console.log('Refreshing profile after save - isPartial:', isPartial);
        const refreshedProfile = await refreshProfile();
        console.log('Profile refreshed, profile_completed:', refreshedProfile?.profile_completed);
      } catch (error) {
        console.error('Error refreshing profile after save:', error);
      }
    }, 500);
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

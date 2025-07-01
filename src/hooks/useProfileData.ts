
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFetch } from './useProfileFetch';
import { useProfileSave } from './useProfileSave';
import { useProfileComplete } from './useProfileComplete';
import { convertProfileToFormData } from '@/utils/profileDataUtils';

export const useProfileData = () => {
  const { user, loading: authLoading, isNewUser, clearNewUserFlag } = useAuth();
  const { profile, loading, setProfile, refreshProfile } = useProfileFetch();
  const { handleProfileSave: saveProfile } = useProfileSave();
  const { handleProfileComplete, profileJustCompleted } = useProfileComplete();

  const handleProfileSave = async (formData: any, isPartial: boolean = false): Promise<void> => {
    console.log('🔄 Starting profile save - isPartial:', isPartial);
    
    try {
      const updateData = await saveProfile(formData, isPartial);
      console.log('✅ Profile save completed, updateData:', updateData);
      
      // Immediately refresh profile to get the latest state
      console.log('🔄 Refreshing profile immediately after save...');
      const refreshedProfile = await refreshProfile();
      console.log('✅ Profile refreshed after save:', {
        profile_completed: refreshedProfile?.profile_completed,
        full_name: refreshedProfile?.full_name,
        updated_at: refreshedProfile ? new Date().toISOString() : 'null'
      });
      
      // Update isNewUser based on refreshed profile completion status
      if (refreshedProfile?.profile_completed) {
        console.log('✅ Profile is completed - clearing new user flag from handleProfileSave');
        clearNewUserFlag();
      }
      
    } catch (error) {
      console.error('❌ Error in handleProfileSave:', error);
      throw error;
    }
  };

  // Refresh profile when user changes or when component mounts
  useEffect(() => {
    if (user && !loading) {
      console.log('🔄 User changed or component mounted, refreshing profile...');
      refreshProfile().then((refreshedProfile) => {
        console.log('✅ Profile refreshed on user change:', {
          profile_completed: refreshedProfile?.profile_completed,
          user_id: user.id
        });

        // Update isNewUser based on refreshed profile completion status
        if (refreshedProfile?.profile_completed) {
          console.log('✅ Profile is completed - clearing new user flag from useEffect');
          clearNewUserFlag();
        }
      }).catch(error => {
        console.error('❌ Error refreshing profile on user change:', error);
      });
    }
  }, [user?.id, refreshProfile, clearNewUserFlag]);

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

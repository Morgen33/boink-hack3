
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileFetch } from './useProfileFetch';
import { useProfileSave } from './useProfileSave';
import { useProfileComplete } from './useProfileComplete';
import { convertProfileToFormData } from '@/utils/profileDataUtils';

export const useProfileData = () => {
  const { user, loading: authLoading, isNewUser } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, setProfile } = useProfileFetch();
  const { handleProfileSave: saveProfile } = useProfileSave();
  const { handleProfileComplete, profileJustCompleted } = useProfileComplete();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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

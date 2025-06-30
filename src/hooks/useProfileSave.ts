
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormData } from '@/types/ProfileTypes';
import { prepareUpdateData } from '@/utils/profileDataUtils';

export const useProfileSave = () => {
  const { user } = useAuth();

  const handleProfileSave = async (formData: ProfileFormData, isPartial: boolean = false) => {
    if (!user) return;

    try {
      console.log('Saving profile with data:', formData);
      
      const updateData = {
        ...prepareUpdateData(formData),
        profile_completed: !isPartial, // Only mark as completed if it's not a partial save
      };

      console.log('Updating profile with:', updateData);

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      console.log('Profile saved successfully');
      return updateData;
    } catch (error: any) {
      console.error('Error saving profile:', error);
      throw error; // Re-throw to let the calling function handle the error
    }
  };

  return { handleProfileSave };
};

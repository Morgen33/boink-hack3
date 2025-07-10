
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormData } from '@/types/ProfileTypes';
import { prepareUpdateData } from '@/utils/profileDataUtils';
import { 
  validateBasicInfoStep, 
  validateAboutYouStep, 
  validateDatingPreferencesStep, 
  validateCryptoProfileStep 
} from '@/utils/profileValidation';

export const useProfileSave = () => {
  const { user } = useAuth();

  const handleProfileSave = async (formData: ProfileFormData, isPartial: boolean = false) => {
    if (!user) {
      console.error('❌ No user found for profile save');
      throw new Error('No user found');
    }

    try {
      console.log('💾 Saving profile with data:', {
        user_id: user.id,
        isPartial,
        has_full_name: !!formData.full_name,
        has_bio: !!formData.bio,
        has_age: !!formData.age,
        photo_count: formData.photo_urls?.length || 0
      });
      
      // Only mark as completed if it's not a partial save AND all required fields are valid
      let isProfileComplete = false;
      if (!isPartial) {
        const step1Valid = validateBasicInfoStep(formData).isValid;
        const step2Valid = validateAboutYouStep(formData).isValid;
        const step3Valid = validateDatingPreferencesStep(formData).isValid;
        const step4Valid = validateCryptoProfileStep(formData).isValid;
        
        isProfileComplete = step1Valid && step2Valid && step3Valid && step4Valid;
        
        console.log('📊 Profile completion validation:', {
          step1_basic_info: step1Valid,
          step2_about_you: step2Valid,
          step3_dating_preferences: step3Valid,
          step4_crypto_profile: step4Valid,
          overall_complete: isProfileComplete
        });
      }
      
      const updateData = {
        ...prepareUpdateData(formData),
        profile_completed: isProfileComplete,
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Updating profile in database with:', {
        profile_completed: updateData.profile_completed,
        full_name: updateData.full_name,
        bio: updateData.bio ? `${updateData.bio.length} chars` : 'no bio',
        age: updateData.age,
        photo_count: updateData.photo_urls?.length || 0,
        is_partial_save: isPartial
      });

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error during profile save:', error);
        throw error;
      }

      console.log('✅ Profile saved successfully to database:', {
        id: data?.id,
        profile_completed: data?.profile_completed,
        updated_at: data?.updated_at,
        full_name: data?.full_name
      });
      
      // Verify the save was successful
      if (data?.profile_completed !== updateData.profile_completed) {
        console.warn('⚠️ Profile completion status mismatch after save:', {
          expected: updateData.profile_completed,
          actual: data?.profile_completed
        });
      }
      
      return updateData;
    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      throw error; // Re-throw to let the calling function handle the error
    }
  };

  return { handleProfileSave };
};

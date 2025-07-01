
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormData } from '@/types/ProfileTypes';
import { useProfileSave } from './useProfileSave';

export const useProfileComplete = () => {
  const { isNewUser, clearNewUserFlag } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleProfileSave } = useProfileSave();
  const [profileJustCompleted, setProfileJustCompleted] = useState(false);

  const handleProfileComplete = async (formData: ProfileFormData) => {
    try {
      console.log('🚀 Starting profile completion process...');
      
      // Save the profile with completion flag
      const updateData = await handleProfileSave(formData, false); // false means complete save
      
      console.log('✅ Profile completed successfully, updateData:', updateData);

      // Clear new user flag if it was set
      if (isNewUser) {
        console.log('🔄 Clearing new user flag...');
        clearNewUserFlag();
      }

      toast({
        title: "Success! 🎉",
        description: isNewUser 
          ? "Welcome to Boink! Your degen profile is now live! Time to find your crypto tribe! 🚀"
          : "Your profile has been updated successfully! You're now visible in discovery! 🚀",
      });

      // Show completion message
      setProfileJustCompleted(true);
      
      // Navigate to discover after showing completion message
      setTimeout(() => {
        console.log('🔄 Navigating to discover page...');
        setProfileJustCompleted(false);
        navigate('/discover');
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile.",
        variant: "destructive",
      });
    }
  };

  return { handleProfileComplete, profileJustCompleted };
};

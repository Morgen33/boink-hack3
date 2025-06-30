
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
      await handleProfileSave(formData, false); // false means complete save
      
      console.log('Profile completed successfully, profile_completed set to true');

      toast({
        title: "Success! 🎉",
        description: isNewUser 
          ? "Welcome to Boink! Your degen profile is now live! Time to find your crypto tribe! 🚀"
          : "Your profile has been updated successfully! 🚀",
      });

      // Show completion message
      setProfileJustCompleted(true);
      
      // Clear new user flag if it was set
      if (isNewUser) {
        clearNewUserFlag();
      }
      
      // Navigate to discover page after a brief delay
      setTimeout(() => {
        navigate('/discover');
      }, 2000);
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile.",
        variant: "destructive",
      });
    }
  };

  return { handleProfileComplete, profileJustCompleted };
};

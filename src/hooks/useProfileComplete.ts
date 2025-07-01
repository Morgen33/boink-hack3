
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
      
      // Save the profile with completion flag - this will mark profile_completed = true in DB
      await handleProfileSave(formData, false); // false means complete save
      
      console.log('✅ Profile completed and saved to database');

      // Clear new user flag if it was set
      if (isNewUser) {
        console.log('🔄 Clearing new user flag...');
        clearNewUserFlag();
      }

      toast({
        title: "Success! 🎉",
        description: isNewUser 
          ? "Welcome to Boink! Your profile is now live and visible in discovery! 🚀"
          : "Your profile has been updated and is visible in discovery! 🚀",
      });

      // Show completion message briefly
      setProfileJustCompleted(true);
      
      // Navigate to discover after showing completion message
      setTimeout(() => {
        console.log('🔄 Navigating to discover page...');
        console.log('🔍 Current window location before navigation:', window.location.href);
        setProfileJustCompleted(false);
        
        // Force navigation by using window.location if React Router navigation fails
        try {
          navigate('/discover');
          console.log('✅ React Router navigation attempted');
          
          // Backup navigation method
          setTimeout(() => {
            if (window.location.pathname !== '/discover') {
              console.log('⚠️ React Router navigation may have failed, using window.location');
              window.location.href = '/discover';
            }
          }, 100);
        } catch (error) {
          console.error('❌ Navigation error:', error);
          window.location.href = '/discover';
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Error completing profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleProfileComplete, profileJustCompleted };
};


import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import ProfileWizard from '@/components/profile/ProfileWizard';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
import IncompleteProfileWarning from '@/components/profile/IncompleteProfileWarning';
import { useProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading,
    profileJustCompleted,
    isNewUser,
    handleProfileSave,
    handleProfileComplete,
    convertProfileToFormData,
    refreshProfile,
  } = useProfileData();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('🔄 No user found, redirecting to auth...');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Refresh profile data when component mounts or when returning from other pages
  useEffect(() => {
    if (user && !loading) {
      console.log('🔄 Profile page mounted, refreshing profile data...');
      refreshProfile().then((refreshedProfile) => {
        console.log('✅ Profile refreshed on mount:', {
          profile_completed: refreshedProfile?.profile_completed,
          has_bio: refreshedProfile?.bio ? 'yes' : 'no',
          has_age: refreshedProfile?.age ? 'yes' : 'no'
        });
      }).catch(error => {
        console.error('❌ Error refreshing profile on mount:', error);
      });
    }
  }, [user, loading, refreshProfile]);

  // Check if we're in edit mode
  const isEditMode = searchParams.get('edit') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show completion message
  if (profileJustCompleted) {
    console.log('🎉 Showing profile completion message');
    return <ProfileCompletion isNewUser={isNewUser} />;
  }

  // Log current profile state for debugging
  console.log('📊 Current profile state:', {
    profile_exists: !!profile,
    profile_completed_db: profile?.profile_completed,
    isEditMode,
    isNewUser,
    searchParams: searchParams.get('edit')
  });

  // TRUST THE DATABASE: If profile is marked as completed in DB, show completed state
  const isProfileCompletedInDB = profile?.profile_completed === true;

  // Show profile wizard for:
  // 1. New users (must complete profile)
  // 2. Edit mode (user explicitly wants to edit)
  // 3. Profile not completed in database
  if (isNewUser || isEditMode || !isProfileCompletedInDB) {
    console.log('📝 Showing profile wizard - reason:', {
      isNewUser,
      isEditMode,
      profile_completed_db: isProfileCompletedInDB,
      reason: isNewUser ? 'new user' : isEditMode ? 'edit mode' : 'not completed in DB'
    });
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <ProfileWizard
            user={user}
            initialData={profile ? convertProfileToFormData(profile) : undefined}
            onComplete={handleProfileComplete}
            onSave={handleProfileSave}
          />
        </div>
      </div>
    );
  }

  // If profile is complete in database, show completion status
  if (isProfileCompletedInDB) {
    console.log('✅ Profile is completed in database, showing completion status');
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">Your Profile is Complete! 🎉</h1>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
                      You're Visible in Discovery!
                    </h2>
                    <p className="text-green-700 dark:text-green-300">
                      Your profile is live and other users can see and match with you.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/discover')}
                  className="bg-gradient-to-r from-web3-red to-web3-magenta text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Discovering Matches
                </button>
                
                <button
                  onClick={() => navigate('/profile?edit=true')}
                  className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            
            {/* Debug info */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <p>Profile ID: {profile.id}</p>
              <p>Profile Completed (DB): {profile.profile_completed ? 'Yes ✅' : 'No ❌'}</p>
              <p>Full Name: {profile.full_name || 'Not set'}</p>
              <p>Bio: {profile.bio ? 'Set ✅' : 'Not set ❌'}</p>
              <p>Age: {profile.age || 'Not set'}</p>
              <p>Photos: {profile.photo_urls?.length || 0} uploaded</p>
              <p>Last Updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should rarely reach here
  console.log('⚠️ Showing incomplete profile warning as fallback');
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <IncompleteProfileWarning />
        </div>
      </div>
    </div>
  );
};

export default Profile;

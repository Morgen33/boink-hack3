
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import ProfileWizard from '@/components/profile/ProfileWizard';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
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

  // Redirect to auth if not authenticated (only for this protected page)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Refresh profile data when component mounts to ensure we have latest data
  useEffect(() => {
    if (user && !loading) {
      refreshProfile().catch(console.error);
    }
  }, [user, loading]);

  // Check if we're in edit mode or if this is a new user
  const isEditing = searchParams.get('edit') === 'true' || isNewUser;

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
    return <ProfileCompletion isNewUser={isNewUser} />;
  }

  // Show profile wizard for new users, editing, or incomplete profiles
  if (isEditing || (profile && !profile.profile_completed)) {
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

  // If profile is complete and we're not editing, redirect to discover
  if (profile?.profile_completed) {
    console.log('Profile is completed, redirecting to discover');
    navigate('/discover');
    return null;
  }

  return null;
};

export default Profile;

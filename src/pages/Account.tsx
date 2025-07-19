import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import Header from '@/components/Header';
import SocialMediaConnections from '@/components/SocialMediaConnections';
import MusicProfile from '@/components/MusicProfile';
import ProfileWizard from '@/components/profile/ProfileWizard';

const Account = () => {
  const { user, loading } = useAuth();
  const { 
    profile, 
    loading: profileLoading, 
    handleProfileSave, 
    handleProfileComplete,
    convertProfileToFormData 
  } = useProfileData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Show ProfileWizard if profile doesn't exist or isn't completed
  const needsProfileSetup = !profile || !profile.profile_completed;
  
  if (needsProfileSetup) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 px-4">
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Social Media Connections */}
            <SocialMediaConnections user={user} />
          </div>

          <div className="space-y-6">
            {/* Music Profile */}
            <MusicProfile user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

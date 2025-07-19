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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Questionnaire - Always Available */}
          <div className="xl:col-span-2">
            <ProfileWizard
              user={user}
              initialData={profile ? convertProfileToFormData(profile) : undefined}
              onComplete={handleProfileComplete}
              onSave={handleProfileSave}
            />
          </div>

          {/* Side Panel - Social Media & Music */}
          <div className="space-y-6">
            {/* Social Media Connections */}
            <SocialMediaConnections user={user} />
            
            {/* Music Profile */}
            <MusicProfile user={user} />
          </div>
        </div>
      </div>
    </div>
  );

};

export default Account;

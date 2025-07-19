import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ProfileSettings from '@/components/profile/ProfileSettings';
import SocialMediaConnections from '@/components/SocialMediaConnections';
import MusicProfile from '@/components/MusicProfile';

const Account = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Profile Settings */}
            <ProfileSettings user={user} />

            {/* Social Media Connections */}
            <SocialMediaConnections user={user} />
          </div>

          <div className="space-y-6">
            {/* Music Profile */}
            <MusicProfile user={user} />
            
            {/* Add other sections here as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

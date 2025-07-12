import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ComprehensiveProfileForm from '@/components/profile/ComprehensiveProfileForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ComprehensiveProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleFormSubmit = async (formData: any) => {
    if (!user) return;

    try {
      // Calculate age from birthdate
      const age = formData.birthdate 
        ? new Date().getFullYear() - formData.birthdate.getFullYear()
        : null;

      // Validate age requirement
      if (age && age < 18) {
        throw new Error('You must be 18 or older to use this platform');
      }

      // Determine platform intent based on purposes
      let platformIntent = 'both';
      if (formData.purposes.length === 1) {
        platformIntent = formData.purposes[0];
      }

      const updateData = {
        // Basic profile
        full_name: user.user_metadata?.full_name || '',
        bio: formData.bio,
        age: age,
        date_of_birth: formData.birthdate?.toISOString().split('T')[0],
        location: formData.location,
        platform_intent: platformIntent as 'dating' | 'networking' | 'both',
        
        // New comprehensive fields
        show_birthdate: formData.showBirthdate,
        investment_philosophy: formData.investmentPhilosophy,
        
        // Crypto profile
        crypto_experience: formData.cryptoExperience,
        favorite_crypto: formData.favoriteCrypto,
        portfolio_size: formData.portfolioSize,
        trading_style: formData.tradingStyle,
        defi_protocols: formData.defiProtocols,
        biggest_crypto_win: formData.biggestWin,
        biggest_crypto_loss: formData.biggestLoss,
        meme_coin_holdings: formData.memeCoinHoldings ? formData.memeCoinHoldings.split(',').map((s: string) => s.trim()) : [],
        
        // Dating fields (if applicable)
        ...(formData.purposes.includes('dating') && {
          gender_identity: formData.genderIdentity,
          sexual_orientation: formData.sexualOrientation,
          looking_for_gender: formData.lookingFor,
          relationship_type: formData.relationshipType,
          crypto_date_preference: formData.cryptoDatePreference,
          ideal_crypto_date: formData.idealCryptoDate,
          crypto_deal_breaker: formData.cryptoDealBreaker,
        }),
        
        // Networking fields (if applicable)
        ...(formData.purposes.includes('networking') && {
          job_title: formData.currentRole,
          industry: formData.industry,
          company_name: formData.company,
          networking_goals: formData.networkingGoals,
          skills_offered: formData.skillsOffered,
          skills_needed: formData.skillsNeeded,
          projects: formData.projects,
        }),
        
        // Privacy settings
        willing_to_relocate: formData.willingToRelocate,
        preferred_meeting_type: formData.preferredMeeting,
        show_in_dating_pool: formData.showInDatingPool,
        show_in_networking_pool: formData.showInNetworkingPool,
        make_profile_public: formData.makeProfilePublic,
        
        // Profile completion flags
        profile_completed: true,
        dating_profile_completed: formData.purposes.includes('dating'),
        networking_profile_completed: formData.purposes.includes('networking'),
        
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Complete! 🚀",
        description: "Welcome to the Boink community!",
      });

      // Navigate based on platform intent
      if (platformIntent === 'dating') {
        navigate('/daily-matches');
      } else if (platformIntent === 'networking') {
        navigate('/discover');
      } else {
        navigate('/discover');
      }

    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-web3-orange"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-web3-yellow/5">
      <ComprehensiveProfileForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ComprehensiveProfile;
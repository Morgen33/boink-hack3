
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PlatformIntentStep from './steps/PlatformIntentStep';
import BasicInfoStep from './steps/BasicInfoStep';
import AboutYouStep from './steps/AboutYouStep';
import NetworkingBasicInfoStep from './steps/NetworkingBasicInfoStep';
import DatingPreferencesStep from './steps/DatingPreferencesStep';
import UnifiedCryptoStep from './steps/UnifiedCryptoStep';
import ReviewStep from './steps/ReviewStep';
import ProfileVisibilityAlert from './ProfileVisibilityAlert';
import ProfileWizardHeader from './ProfileWizardHeader';
import ProfileWizardNavigation from './ProfileWizardNavigation';
import ProfileWizardValidation from './ProfileWizardValidation';
import { User } from '@supabase/supabase-js';
import { ProfileFormData } from '@/types/ProfileTypes';
import { validateStepByNumber } from '@/utils/profileValidation';

const getSteps = () => {
  return [
    { id: 1, title: 'Platform Intent', description: 'What brings you here' },
    { id: 2, title: 'Basic Info', description: 'Name, age, location & photos' },
    { id: 3, title: 'About You', description: 'Your story & interests' },
    { id: 4, title: 'Professional Info', description: 'Work & networking details' },
    { id: 5, title: 'Dating Preferences', description: 'Who you\'re looking for' },
    { id: 6, title: 'Crypto Profile', description: 'Your crypto journey' },
    { id: 7, title: 'Review', description: 'Finalize your profile' }
  ];
};

interface ProfileWizardProps {
  user: User;
  initialData?: Partial<ProfileFormData>;
  onComplete: (data: ProfileFormData) => Promise<void>;
  onSave?: (data: ProfileFormData, isPartial: boolean) => Promise<void>;
}

const ProfileWizard = ({ user, initialData, onComplete, onSave }: ProfileWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileFormData>({
    // Platform Intent
    platform_intent: initialData?.platform_intent || '',
    // Basic Info
    full_name: initialData?.full_name || '',
    username: initialData?.username || '',
    age: initialData?.age || '',
    date_of_birth: initialData?.date_of_birth || '',
    location: initialData?.location || '',
    avatar_url: initialData?.avatar_url || '',
    bio: initialData?.bio || '',
    interests: initialData?.interests || '',
    looking_for: initialData?.looking_for || '',
    gender_identity: initialData?.gender_identity || '',
    sexual_orientation: initialData?.sexual_orientation || '',
    looking_for_gender: initialData?.looking_for_gender || [],
    relationship_type: initialData?.relationship_type || '',
    // Photo fields
    photo_urls: initialData?.photo_urls || [],
    main_photo_index: initialData?.main_photo_index || 0,
    // Crypto fields
    wallet_address: initialData?.wallet_address || '',
    favorite_crypto: initialData?.favorite_crypto || '',
    crypto_experience: initialData?.crypto_experience || '',
    portfolio_size: initialData?.portfolio_size || '',
    trading_style: initialData?.trading_style || '',
    defi_protocols: initialData?.defi_protocols || [],
    nft_collections: initialData?.nft_collections || '',
    meme_coin_holdings: initialData?.meme_coin_holdings || '',
    biggest_crypto_win: initialData?.biggest_crypto_win || '',
    biggest_crypto_loss: initialData?.biggest_crypto_loss || '',
    crypto_motto: initialData?.crypto_motto || '',
    favorite_memes: initialData?.favorite_memes || [],
    // Professional/Networking fields
    job_title: initialData?.job_title || '',
    company_name: initialData?.company_name || '',
    industry: initialData?.industry || '',
    professional_bio: initialData?.professional_bio || '',
    networking_goals: initialData?.networking_goals || [],
    expertise_areas: initialData?.expertise_areas || [],
    linkedin_url: initialData?.linkedin_url || '',
    website_url: initialData?.website_url || '',
    // New comprehensive form fields
    show_birthdate: initialData?.show_birthdate || false,
    investment_philosophy: initialData?.investment_philosophy || '',
    crypto_date_preference: initialData?.crypto_date_preference || '',
    ideal_crypto_date: initialData?.ideal_crypto_date || '',
    crypto_deal_breaker: initialData?.crypto_deal_breaker || '',
    willing_to_relocate: initialData?.willing_to_relocate || '',
    preferred_meeting_type: initialData?.preferred_meeting_type || '',
    show_in_dating_pool: initialData?.show_in_dating_pool !== undefined ? initialData.show_in_dating_pool : true,
    show_in_networking_pool: initialData?.show_in_networking_pool !== undefined ? initialData.show_in_networking_pool : true,
    make_profile_public: initialData?.make_profile_public !== undefined ? initialData.make_profile_public : true,
    skills_offered: initialData?.skills_offered || [],
    skills_needed: initialData?.skills_needed || [],
    projects: initialData?.projects || [],
  });

  const updateFormData = (updates: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const steps = getSteps();
  const currentValidation = validateStepByNumber(currentStep, formData);

  const handleNext = () => {
    // Validate current step before allowing navigation
    if (!currentValidation.isValid && currentStep < 5) {
      toast({
        title: "Required Fields Missing",
        description: `Please complete all required fields in ${steps[currentStep - 1].title} before continuing.`,
        variant: "destructive",
      });
      return;
    }

    // If we're editing from review, go back to review instead of next step
    if (isEditingFromReview) {
      setCurrentStep(7);
      setIsEditingFromReview(false);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    // If we're editing from review, go back to review
    if (isEditingFromReview) {
      setCurrentStep(7);
      setIsEditingFromReview(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData, true); // true indicates this is a partial save
      toast({
        title: "Profile Saved! 💾",
        description: "Your progress has been saved. You can continue later or keep editing.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    await onComplete(formData);
  };

  const handleEditFromReview = (stepNumber: number) => {
    setIsEditingFromReview(true);
    setCurrentStep(stepNumber);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PlatformIntentStep data={formData} onUpdate={updateFormData} />;
      case 2:
        return <BasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 3:
        return <AboutYouStep data={formData} onUpdate={updateFormData} />;
      case 4:
        return <NetworkingBasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 5:
        return <DatingPreferencesStep data={formData} onUpdate={updateFormData} />;
      case 6:
        return <UnifiedCryptoStep data={formData} onUpdate={updateFormData} />;
      case 7:
        return (
          <ReviewStep 
            data={formData} 
            onUpdate={updateFormData} 
            onComplete={handleComplete}
            onBack={handlePrevious}
            onEditStep={handleEditFromReview}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Progress Header */}
      <ProfileWizardHeader
        currentStep={currentStep}
        steps={steps}
        isEditingFromReview={isEditingFromReview}
        onSave={onSave ? handleSave : undefined}
        isSaving={isSaving}
      />

      {/* Validation Status */}
      <ProfileWizardValidation
        currentStep={currentStep}
        steps={steps}
        validation={currentValidation}
      />

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation - Show for all steps except when ReviewStep handles its own navigation */}
      {currentStep < steps.length && (
        <ProfileWizardNavigation
          currentStep={currentStep}
          isEditingFromReview={isEditingFromReview}
          validation={currentValidation}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default ProfileWizard;

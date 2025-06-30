import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BasicInfoStep from './steps/BasicInfoStep';
import AboutYouStep from './steps/AboutYouStep';
import DatingPreferencesStep from './steps/DatingPreferencesStep';
import CryptoProfileStep from './steps/CryptoProfileStep';
import ReviewStep from './steps/ReviewStep';
import { User } from '@supabase/supabase-js';
import { ProfileFormData } from '@/types/ProfileTypes';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 2, title: 'About You', description: 'Share your story' },
  { id: 3, title: 'Dating Preferences', description: 'Who are you looking for' },
  { id: 4, title: 'Crypto Profile', description: 'Your crypto journey' },
  { id: 5, title: 'Review', description: 'Finalize your profile' },
];

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
    defi_protocols: initialData?.defi_protocols || '',
    nft_collections: initialData?.nft_collections || '',
    meme_coin_holdings: initialData?.meme_coin_holdings || '',
    biggest_crypto_win: initialData?.biggest_crypto_win || '',
    biggest_crypto_loss: initialData?.biggest_crypto_loss || '',
    crypto_motto: initialData?.crypto_motto || '',
  });

  const updateFormData = (updates: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    // If we're editing from review, go back to review instead of next step
    if (isEditingFromReview) {
      setCurrentStep(5);
      setIsEditingFromReview(false);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    // If we're editing from review, go back to review
    if (isEditingFromReview) {
      setCurrentStep(5);
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
        return <BasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 2:
        return <AboutYouStep data={formData} onUpdate={updateFormData} />;
      case 3:
        return <DatingPreferencesStep data={formData} onUpdate={updateFormData} />;
      case 4:
        return <CryptoProfileStep data={formData} onUpdate={updateFormData} />;
      case 5:
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

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
              {isEditingFromReview && " (Editing)"}
            </span>
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Progress'}
              </Button>
            )}
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {steps[currentStep - 1].title}
            {isEditingFromReview && " - Edit Mode"}
          </h2>
          <p className="text-muted-foreground">
            {isEditingFromReview 
              ? "Make your changes and click 'Return to Review' when done"
              : steps[currentStep - 1].description
            }
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation - Show for all steps except when ReviewStep handles its own navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 && !isEditingFromReview}
          >
            {isEditingFromReview ? (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Review
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </>
            )}
          </Button>
          
          <Button onClick={handleNext}>
            {isEditingFromReview ? (
              <>
                Return to Review
                <ArrowLeft className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileWizard;

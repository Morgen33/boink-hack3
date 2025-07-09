import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import { useToast } from '@/hooks/use-toast';
import NetworkingBasicInfoStep from './steps/NetworkingBasicInfoStep';
import NetworkingBackgroundStep from './steps/NetworkingBackgroundStep';
import NetworkingPreferencesStep from './steps/NetworkingPreferencesStep';
import NetworkingReviewStep from './steps/NetworkingReviewStep';

const STEPS = [
  { id: 1, title: 'Professional Info', component: NetworkingBasicInfoStep },
  { id: 2, title: 'Crypto Background', component: NetworkingBackgroundStep },
  { id: 3, title: 'Networking Goals', component: NetworkingPreferencesStep },
  { id: 4, title: 'Review', component: NetworkingReviewStep },
];

interface NetworkingFormData {
  full_name: string;
  company_name: string;
  job_title: string;
  industry: string;
  years_in_crypto: string;
  networking_goals: string[];
  expertise_areas: string[];
  professional_bio: string;
  linkedin_url: string;
  website_url: string;
  looking_for_networking: string[];
}

const NetworkingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NetworkingFormData>({
    full_name: '',
    company_name: '',
    job_title: '',
    industry: '',
    years_in_crypto: '',
    networking_goals: [],
    expertise_areas: [],
    professional_bio: '',
    linkedin_url: '',
    website_url: '',
    looking_for_networking: [],
  });

  const { handleProfileSave } = useProfileData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const networkingData = {
        ...formData,
        years_in_crypto: parseInt(formData.years_in_crypto) || 0,
        networking_completed: true,
      };

      await handleProfileSave(networkingData, false);
      
      toast({
        title: "Networking Profile Complete!",
        description: "Welcome to the professional Web3 community.",
      });
      
      navigate('/discover/networking');
    } catch (error) {
      console.error('Error completing networking profile:', error);
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Professional Profile Setup</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  index + 1 <= currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <CurrentStepComponent 
            data={formData} 
            onUpdate={handleInputChange}
          />

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 flex items-center gap-2"
              >
                Complete Profile
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingWizard;
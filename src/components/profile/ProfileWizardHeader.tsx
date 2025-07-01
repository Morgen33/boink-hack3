
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProfileWizardHeaderProps {
  currentStep: number;
  steps: Step[];
  isEditingFromReview: boolean;
  onSave?: () => void;
  isSaving: boolean;
}

const ProfileWizardHeader = ({ 
  currentStep, 
  steps, 
  isEditingFromReview, 
  onSave, 
  isSaving 
}: ProfileWizardHeaderProps) => {
  const progress = (currentStep / steps.length) * 100;

  return (
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
              onClick={onSave}
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
  );
};

export default ProfileWizardHeader;

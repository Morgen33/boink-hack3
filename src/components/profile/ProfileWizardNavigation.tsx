
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { ValidationResult } from '@/utils/profileValidation';

interface ProfileWizardNavigationProps {
  currentStep: number;
  isEditingFromReview: boolean;
  validation: ValidationResult;
  onPrevious: () => void;
  onNext: () => void;
}

const ProfileWizardNavigation = ({
  currentStep,
  isEditingFromReview,
  validation,
  onPrevious,
  onNext
}: ProfileWizardNavigationProps) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
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
      
      <Button 
        onClick={onNext}
        disabled={!validation.isValid && currentStep < 5}
      >
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
  );
};

export default ProfileWizardNavigation;


import ValidationStatus from './ValidationStatus';
import { ValidationResult } from '@/utils/profileValidation';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProfileWizardValidationProps {
  currentStep: number;
  steps: Step[];
  validation: ValidationResult;
}

const ProfileWizardValidation = ({ 
  currentStep, 
  steps, 
  validation 
}: ProfileWizardValidationProps) => {
  // Only show validation for steps 1-4
  if (currentStep >= 5) {
    return null;
  }

  return (
    <div className="mb-6">
      <ValidationStatus 
        validation={validation} 
        stepTitle={steps[currentStep - 1].title}
      />
    </div>
  );
};

export default ProfileWizardValidation;

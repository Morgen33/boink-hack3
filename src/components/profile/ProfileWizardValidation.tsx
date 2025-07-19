
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
  // Only show validation for steps 2-4 (skip step 1 Platform Intent and steps 5+ which don't need validation)
  // Step 1 is always valid once a selection is made, and progress bar shows completion
  if (currentStep === 1 || currentStep >= 5) {
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

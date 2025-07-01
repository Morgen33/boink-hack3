
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ValidationResult } from '@/utils/profileValidation';

interface ValidationStatusProps {
  validation: ValidationResult;
  stepTitle: string;
}

const ValidationStatus = ({ validation, stepTitle }: ValidationStatusProps) => {
  if (validation.isValid) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          {stepTitle} completed! All required fields are filled.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="text-orange-800 dark:text-orange-200 font-medium">
            Please complete the following required fields:
          </p>
          <div className="flex flex-wrap gap-2">
            {validation.missingFields.map((field) => (
              <Badge key={field} variant="outline" className="text-orange-700 border-orange-300">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationStatus;

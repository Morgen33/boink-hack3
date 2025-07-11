import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MINIMUM_AGE } from '@/utils/ageVerification';

interface AgeVerificationProps {
  dateOfBirth: string;
  setDateOfBirth: (date: string) => void;
  loading: boolean;
  calculatedAge: number;
  isUserOldEnough: boolean;
}

export const AgeVerification = ({ 
  dateOfBirth, 
  setDateOfBirth, 
  loading, 
  calculatedAge, 
  isUserOldEnough 
}: AgeVerificationProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
      <Input
        id="dateOfBirth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        required
        disabled={loading}
        max={new Date(new Date().setFullYear(new Date().getFullYear() - MINIMUM_AGE)).toISOString().split('T')[0]}
      />
      {dateOfBirth && !isUserOldEnough && (
        <div className="space-y-1">
          <p className="text-sm text-red-600 flex items-center gap-1 font-semibold">
            🚫 REGISTRATION BLOCKED: Must be {MINIMUM_AGE}+ years old
          </p>
          <p className="text-xs text-red-500">
            Current age: {calculatedAge} years. This platform is strictly for adults only.
          </p>
        </div>
      )}
      {dateOfBirth && isUserOldEnough && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          ✅ Age verified ({calculatedAge} years old)
        </p>
      )}
    </div>
  );
};
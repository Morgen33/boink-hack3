import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { validateAge, getAgeVerificationError, calculateAge } from '@/utils/ageVerification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: (birthDate: Date) => void;
}

const AgeVerificationModal = ({ isOpen, onVerified }: AgeVerificationModalProps) => {
  const [birthDate, setBirthDate] = useState<Date>();
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { user } = useSimpleAuth();

  const handleVerification = async () => {
    if (!birthDate) {
      toast({
        title: "Date Required",
        description: "Please select your date of birth to verify your age.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to verify your age.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    const validation = validateAge(birthDate);
    
    if (validation.isValid) {
      try {
        // Save birth date and age to profile
        const age = calculateAge(birthDate);
        const { error } = await supabase
          .from('profiles')
          .update({
            date_of_birth: birthDate.toISOString().split('T')[0],
            age: age
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving birth date:', error);
          toast({
            title: "Save Error",
            description: "Failed to save your birth date. Please try again.",
            variant: "destructive",
          });
          setIsVerifying(false);
          return;
        }

        toast({
          title: "Age Verified",
          description: "Thank you for verifying your age. You may now proceed.",
        });
        onVerified(birthDate);
      } catch (error) {
        console.error('Error during age verification:', error);
        toast({
          title: "Verification Error",
          description: "An error occurred during verification. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Age Verification Failed",
        description: validation.error || getAgeVerificationError(),
        variant: "destructive",
      });
    }
    
    setIsVerifying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-destructive">
            Age Verification Required
          </DialogTitle>
          <DialogDescription className="text-base mt-4">
            <div className="space-y-3">
              <p className="font-semibold text-lg">🔞 Adults Only (18+)</p>
              <p>
                This platform is restricted to users who are at least 18 years old. 
                We are required by law to verify your age before you can access our services.
              </p>
              <p className="text-sm text-muted-foreground">
                Your date of birth will only be used for age verification and will be stored securely.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : "Select your date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="pointer-events-auto"
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Important Legal Notice:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• You must be 18 or older to use this platform</li>
              <li>• Providing false information is prohibited</li>
              <li>• Age verification is required for compliance with applicable laws</li>
              <li>• Your privacy is protected under our Privacy Policy</li>
            </ul>
          </div>

          <Button 
            onClick={handleVerification}
            disabled={!birthDate || isVerifying}
            className="w-full"
            size="lg"
          >
            {isVerifying ? "Verifying..." : "Verify My Age"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationModal;
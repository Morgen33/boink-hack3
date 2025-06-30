
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Calendar, MapPin, AtSign, Eye, EyeOff } from 'lucide-react';

interface BasicInfoFormProps {
  data: any;
  onUpdate: (field: string, value: string | boolean) => void;
}

const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '';
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age > 0 ? age.toString() : '';
};

const BasicInfoForm = ({ data, onUpdate }: BasicInfoFormProps) => {
  const handleDateChange = (value: string) => {
    onUpdate('date_of_birth', value);
    // Auto-calculate and update age
    const calculatedAge = calculateAge(value);
    onUpdate('age', calculatedAge);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => onUpdate('full_name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <AtSign className="w-4 h-4" />
            Username *
          </Label>
          <Input
            id="username"
            value={data.username}
            onChange={(e) => onUpdate('username', e.target.value)}
            placeholder="@cryptoqueen"
            required
          />
          <p className="text-xs text-muted-foreground">
            This will be your unique handle on the platform
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth *
          </Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => handleDateChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age (Auto-calculated)</Label>
          <Input
            id="age"
            type="text"
            value={data.age}
            placeholder="Will auto-fill from birthdate"
            readOnly
            className="bg-muted cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hide_exact_birthdate"
            checked={data.hide_exact_birthdate || false}
            onCheckedChange={(checked) => onUpdate('hide_exact_birthdate', !!checked)}
          />
          <Label 
            htmlFor="hide_exact_birthdate"
            className="text-sm font-normal cursor-pointer flex items-center gap-2"
          >
            {data.hide_exact_birthdate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Hide my exact birthdate (only show age to others)
          </Label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          When checked, other users will only see your age, not your exact birthday. Your age will still be visible for matching purposes.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => onUpdate('location', e.target.value)}
          placeholder="New York, NY"
        />
        <p className="text-xs text-muted-foreground">
          Optional: This helps others find local crypto meetups with you
        </p>
      </div>
    </div>
  );
};

export default BasicInfoForm;

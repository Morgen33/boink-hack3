
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Calendar, MapPin, AtSign } from 'lucide-react';

interface BasicInfoStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const BasicInfoStep = ({ data, onUpdate }: BasicInfoStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <p className="text-muted-foreground">
          Let's start with the basics. This information helps others find and connect with you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
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
            onChange={(e) => handleInputChange('username', e.target.value)}
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
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            placeholder="25"
            min="18"
            max="100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth *
          </Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="New York, NY"
        />
        <p className="text-xs text-muted-foreground">
          Optional: This helps others find local crypto meetups with you
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Photo Upload</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Add a profile photo to increase your matches by 10x! 📸
        </p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            // TODO: Implement photo upload
            console.log('Photo upload:', e.target.files?.[0]);
          }}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Supported formats: JPG, PNG, WebP (max 5MB)
        </p>
      </div>
    </div>
  );
};

export default BasicInfoStep;

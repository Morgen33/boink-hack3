
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Calendar, MapPin, AtSign } from 'lucide-react';

interface BasicInfoFormProps {
  data: any;
  onUpdate: (field: string, value: string) => void;
}

const BasicInfoForm = ({ data, onUpdate }: BasicInfoFormProps) => {
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
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => onUpdate('age', e.target.value)}
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
            onChange={(e) => onUpdate('date_of_birth', e.target.value)}
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

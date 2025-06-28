
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users } from 'lucide-react';

interface GenderPreferencesProps {
  genderIdentity: string;
  sexualOrientation: string;
  lookingForGender: string[];
  relationshipType: string;
  onGenderIdentityChange: (value: string) => void;
  onSexualOrientationChange: (value: string) => void;
  onLookingForGenderChange: (values: string[]) => void;
  onRelationshipTypeChange: (value: string) => void;
}

const genderOptions = [
  'Man',
  'Woman', 
  'Non-binary',
  'Transgender Man',
  'Transgender Woman',
  'Genderfluid',
  'Other',
  'Prefer not to say'
];

const orientationOptions = [
  'Straight',
  'Gay',
  'Lesbian', 
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Demisexual',
  'Queer',
  'Other',
  'Prefer not to say'
];

const relationshipOptions = [
  'Serious relationship',
  'Casual dating',
  'Friends first',
  'Hookups',
  'Open to anything',
  'Prefer not to say'
];

const GenderPreferences = ({
  genderIdentity,
  sexualOrientation,
  lookingForGender,
  relationshipType,
  onGenderIdentityChange,
  onSexualOrientationChange,
  onLookingForGenderChange,
  onRelationshipTypeChange
}: GenderPreferencesProps) => {
  const handleLookingForChange = (gender: string, checked: boolean) => {
    if (checked) {
      onLookingForGenderChange([...lookingForGender, gender]);
    } else {
      onLookingForGenderChange(lookingForGender.filter(g => g !== gender));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Dating Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gender_identity">Gender Identity</Label>
            <Select value={genderIdentity} onValueChange={onGenderIdentityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your gender identity" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexual_orientation">Sexual Orientation</Label>
            <Select value={sexualOrientation} onValueChange={onSexualOrientationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your sexual orientation" />
              </SelectTrigger>
              <SelectContent>
                {orientationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Looking for (select all that apply)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genderOptions.filter(option => option !== 'Prefer not to say').map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <Checkbox
                  id={`looking-${gender}`}
                  checked={lookingForGender.includes(gender)}
                  onCheckedChange={(checked) => handleLookingForChange(gender, !!checked)}
                />
                <Label 
                  htmlFor={`looking-${gender}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {gender}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship_type">Looking for</Label>
          <Select value={relationshipType} onValueChange={onRelationshipTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="What type of relationship are you seeking?" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderPreferences;

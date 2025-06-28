
import GenderPreferences from '../GenderPreferences';
import { Heart, Users } from 'lucide-react';

interface DatingPreferencesStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const DatingPreferencesStep = ({ data, onUpdate }: DatingPreferencesStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <p className="text-muted-foreground">
          Help us understand your dating preferences so we can show you the most compatible crypto enthusiasts.
        </p>
      </div>

      <GenderPreferences
        genderIdentity={data.gender_identity}
        sexualOrientation={data.sexual_orientation}
        lookingForGender={data.looking_for_gender}
        relationshipType={data.relationship_type}
        onGenderIdentityChange={(value) => onUpdate({ gender_identity: value })}
        onSexualOrientationChange={(value) => onUpdate({ sexual_orientation: value })}
        onLookingForGenderChange={(values) => onUpdate({ looking_for_gender: values })}
        onRelationshipTypeChange={(value) => onUpdate({ relationship_type: value })}
      />

      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Why We Ask This
        </h4>
        <p className="text-sm text-muted-foreground">
          Your preferences help us show you compatible matches and create a safe, 
          inclusive space for everyone in the crypto community. All information 
          is kept private and only used for matching purposes.
        </p>
      </div>
    </div>
  );
};

export default DatingPreferencesStep;

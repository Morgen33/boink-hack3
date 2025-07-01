
import { useState } from 'react';
import { User } from 'lucide-react';
import BasicInfoForm from './BasicInfoForm';
import PhotoUpload from './PhotoUpload';
import { validateBasicInfoStep } from '@/utils/profileValidation';

interface BasicInfoStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

interface Photo {
  id: string;
  url: string;
  file?: File;
  isUploading?: boolean;
}

const BasicInfoStep = ({ data, onUpdate }: BasicInfoStepProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const validation = validateBasicInfoStep(data);

  const handleInputChange = (field: string, value: string | boolean) => {
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

      <BasicInfoForm data={data} onUpdate={handleInputChange} />

      <div className="space-y-2">
        <h4 className="font-medium flex items-center gap-2">
          Profile Photos *
          {validation.errors.photo_urls && (
            <span className="text-sm text-red-600 font-normal">- At least one photo required</span>
          )}
        </h4>
        <PhotoUpload
          photos={photos}
          setPhotos={setPhotos}
          mainPhotoIndex={mainPhotoIndex}
          setMainPhotoIndex={setMainPhotoIndex}
          onUpdate={onUpdate}
          data={data}
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;

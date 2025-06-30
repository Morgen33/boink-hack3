
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, MapPin, AtSign, Upload, X, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const remainingSlots = 6 - photos.length;

    if (newFiles.length > remainingSlots) {
      toast({
        title: "Too many photos",
        description: `You can only upload ${remainingSlots} more photo(s). Maximum 6 photos allowed.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to upload photos');
      }

      console.log('Current user:', user.id);

      const uploadPromises = newFiles.map(async (file, index) => {
        const photoId = `${Date.now()}-${index}`;
        const fileName = `${photoId}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;
        
        console.log('Uploading file to path:', filePath);

        // Create temporary photo object
        const tempPhoto: Photo = {
          id: photoId,
          url: URL.createObjectURL(file),
          file,
          isUploading: true
        };

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          throw error;
        }

        console.log('Upload successful:', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(data.path);

        console.log('Public URL:', publicUrl);

        return {
          ...tempPhoto,
          url: publicUrl,
          isUploading: false
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...uploadedPhotos]);

      // Update form data with photo URLs
      const photoUrls = uploadedPhotos.map(p => p.url);
      onUpdate({ 
        photo_urls: [...(data.photo_urls || []), ...photoUrls],
        avatar_url: data.avatar_url || photoUrls[0] // Set first photo as avatar if no main photo set
      });

      toast({
        title: "Photos uploaded! 📸",
        description: `Successfully uploaded ${newFiles.length} photo(s).`,
      });

    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== photoId);
      // Adjust main photo index if needed
      if (mainPhotoIndex >= filtered.length && filtered.length > 0) {
        setMainPhotoIndex(filtered.length - 1);
      }
      return filtered;
    });

    // Update form data
    const updatedUrls = photos.filter(p => p.id !== photoId).map(p => p.url);
    onUpdate({ 
      photo_urls: updatedUrls,
      main_photo_index: mainPhotoIndex >= updatedUrls.length ? 0 : mainPhotoIndex
    });
  };

  const handleSetMainPhoto = (index: number) => {
    setMainPhotoIndex(index);
    onUpdate({ 
      main_photo_index: index,
      avatar_url: photos[index]?.url 
    });
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

      {/* Photo Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Profile Photos</h4>
          <Badge variant="outline">{photos.length}/6</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Upload up to 6 photos to increase your matches by 10x! The first photo will be your main profile photo. 📸
        </p>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {photo.isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}

                    {/* Main photo indicator */}
                    {index === mainPhotoIndex && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-yellow-900 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Main
                        </Badge>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index !== mainPhotoIndex && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSetMainPhoto(index)}
                          title="Set as main photo"
                        >
                          <Star className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemovePhoto(photo.id)}
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {photos.length < 6 && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <p className="font-medium">Upload Photos</p>
                  <p className="text-sm text-muted-foreground">
                    Choose up to {6 - photos.length} more photo(s)
                  </p>
                </div>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Select Photos'}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP (max 5MB each)
        </p>
      </div>
    </div>
  );
};

export default BasicInfoStep;

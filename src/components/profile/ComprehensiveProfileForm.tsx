import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Heart, Users, Upload, Plus, X, Rocket } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SocialMediaConnections from '@/components/SocialMediaConnections';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  // Purpose Selection
  purposes: string[];
  
  // Base Profile
  photos: File[];
  birthdate: Date | undefined;
  showBirthdate: boolean;
  bio: string;
  location: string;
  cryptoExperience: string;
  favoriteCrypto: string;
  portfolioSize: string;
  tradingStyle: string;
  defiProtocols: string[];
  biggestWin: string;
  biggestLoss: string;
  nftImages: File[];
  memeCoinHoldings: string;
  favoriteMemesImages: File[];
  favoriteMemesCaptions: string[];
  investmentPhilosophy: string;
  
  // New Crypto Fields
  nftCollections?: string;
  favoriteMemesText?: string;
  yearsInCrypto?: string;
  degenScore?: string;
  defiProtocolsText?: string;
  cryptoMotto?: string;
  
  // Dating Section
  genderIdentity: string;
  sexualOrientation: string;
  lookingFor: string[];
  relationshipType: string;
  cryptoDatePreference: string;
  idealCryptoDate: string;
  cryptoDealBreaker: string;
  
  // Networking Section
  currentRole: string;
  industry: string;
  company: string;
  networkingGoals: string[];
  skillsOffered: string[];
  skillsNeeded: string[];
  projects: Array<{name: string, description: string, link: string}>;
  resume?: File;
  workStatus: string; // looking for work or looking to hire
  
  // Additional Preferences
  willingToRelocate: string;
  preferredMeeting: string;
  showInDatingPool: boolean;
  showInNetworkingPool: boolean;
  makeProfilePublic: boolean;
}

interface ComprehensiveProfileFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
}

const ComprehensiveProfileForm = ({ onSubmit, initialData }: ComprehensiveProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    purposes: [],
    photos: [],
    birthdate: undefined,
    showBirthdate: false,
    bio: '',
    location: '',
    cryptoExperience: '',
    favoriteCrypto: '',
    portfolioSize: '',
    tradingStyle: '',
    defiProtocols: [],
    biggestWin: '',
    biggestLoss: '',
    nftImages: [],
    memeCoinHoldings: '',
    favoriteMemesImages: [],
    favoriteMemesCaptions: [],
    investmentPhilosophy: '',
    genderIdentity: '',
    sexualOrientation: '',
    lookingFor: [],
    relationshipType: '',
    cryptoDatePreference: '',
    idealCryptoDate: '',
    cryptoDealBreaker: '',
    currentRole: '',
    industry: '',
    company: '',
    networkingGoals: [],
    skillsOffered: [],
    skillsNeeded: [],
    projects: [],
    workStatus: '',
    willingToRelocate: '',
    preferredMeeting: '',
    showInDatingPool: true,
    showInNetworkingPool: true,
    makeProfilePublic: true,
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      console.log('Auto-saving form data...');
    }, 30000);

    return () => clearInterval(autoSave);
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const togglePurpose = (purpose: string) => {
    const newPurposes = formData.purposes.includes(purpose)
      ? formData.purposes.filter(p => p !== purpose)
      : [...formData.purposes, purpose];
    updateFormData({ purposes: newPurposes });
  };

  const addProject = () => {
    updateFormData({
      projects: [...formData.projects, { name: '', description: '', link: '' }]
    });
  };

  const updateProject = (index: number, updates: Partial<typeof formData.projects[0]>) => {
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], ...updates };
    updateFormData({ projects: newProjects });
  };

  const removeProject = (index: number) => {
    updateFormData({
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  // Photo upload handlers
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 6 - formData.photos.length;
    if (files.length > remainingSlots) {
      toast({
        title: "Too many photos",
        description: `You can only upload ${remainingSlots} more photo(s). Maximum 6 photos allowed.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to upload photos');
      }

      const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${index}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        return file;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      updateFormData({ photos: [...formData.photos, ...uploadedFiles] });

      toast({
        title: "Photos uploaded! 📸",
        description: `Successfully uploaded ${files.length} photo(s).`,
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
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleNFTUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = Array.from(files);
      updateFormData({ nftImages: [...formData.nftImages, ...uploadedFiles] });
      
      toast({
        title: "NFT images uploaded! 🎨",
        description: `Successfully uploaded ${files.length} NFT image(s).`,
      });
    } catch (error: any) {
      console.error('Error uploading NFT images:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload NFT images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleMemeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = Array.from(files);
      updateFormData({ favoriteMemesImages: [...formData.favoriteMemesImages, ...uploadedFiles] });
      
      toast({
        title: "Meme images uploaded! 😂",
        description: `Successfully uploaded ${files.length} meme image(s).`,
      });
    } catch (error: any) {
      console.error('Error uploading meme images:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload meme images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type (PDF only)
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Resume must be smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      updateFormData({ resume: file });
      
      toast({
        title: "Resume uploaded! 📄",
        description: "Your resume has been added to your profile.",
      });
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const calculateProgress = () => {
    let totalFields = 8; // Base fields
    let completedFields = 0;

    // Base profile completion
    if (formData.photos.length > 0) completedFields++;
    if (formData.birthdate) completedFields++;
    if (formData.bio) completedFields++;
    if (formData.location) completedFields++;
    if (formData.cryptoExperience) completedFields++;
    if (formData.favoriteCrypto) completedFields++;
    if (formData.portfolioSize) completedFields++;
    if (formData.tradingStyle) completedFields++;

    // Add dating fields if dating is selected
    if (formData.purposes.includes('dating')) {
      totalFields += 3;
      if (formData.genderIdentity) completedFields++;
      if (formData.sexualOrientation) completedFields++;
      if (formData.relationshipType) completedFields++;
    }

    // Add networking fields if networking is selected
    if (formData.purposes.includes('networking')) {
      totalFields += 3;
      if (formData.currentRole) completedFields++;
      if (formData.industry) completedFields++;
      if (formData.networkingGoals.length > 0) completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const validateAge = (date: Date | undefined) => {
    if (!date) return false;
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.purposes.length === 0) {
      toast({
        title: "Purpose Required",
        description: "Please select what brings you to Boink.",
        variant: "destructive"
      });
      return;
    }

    if (!validateAge(formData.birthdate)) {
      toast({
        title: "Age Verification Required",
        description: "You must be 18 or older to use this platform.",
        variant: "destructive"
      });
      return;
    }

    if (formData.photos.length === 0) {
      toast({
        title: "Photo Required",
        description: "Please add at least one profile photo.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast({
        title: "Profile Complete! 🚀",
        description: "Welcome to the Boink community!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonText = () => {
    if (formData.purposes.includes('dating') && formData.purposes.includes('networking')) {
      return "Start Dating & Networking 🚀";
    } else if (formData.purposes.includes('dating')) {
      return "Start Dating 💕";
    } else if (formData.purposes.includes('networking')) {
      return "Start Networking 🤝";
    }
    return "Complete Profile & Go Live! 🚀";
  };

  const isDatingEnabled = formData.purposes.includes('dating');
  const isNetworkingEnabled = formData.purposes.includes('networking');

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-yellow/5 via-background to-web3-orange/10">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-web3-orange/10 to-web3-yellow/10 backdrop-blur-sm border-b border-web3-orange/20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Profile Completion</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-3" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-web3-red via-web3-magenta to-web3-orange bg-clip-text text-transparent">
            Complete Your Boink Profile
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tell us about yourself to connect with the right crypto community members
          </p>
        </div>

        <div className="space-y-20">
          {/* Purpose Selection Section */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-web3-orange to-web3-red bg-clip-text text-transparent">
                <Rocket className="w-8 h-8 text-web3-orange" />
                What brings you to Boink?
              </h2>
              <p className="text-muted-foreground text-lg">Choose what you're looking for to customize your experience</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div 
                className={cn(
                  "border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105",
                  formData.purposes.includes('dating') 
                    ? "border-web3-magenta bg-gradient-to-br from-web3-magenta/10 to-web3-red/20 shadow-lg shadow-web3-magenta/20" 
                    : "border-border hover:border-web3-magenta hover:bg-web3-magenta/5"
                )}
                onClick={() => togglePurpose('dating')}
              >
                <div className="text-center space-y-4">
                  <Heart className={cn("w-12 h-12 mx-auto", formData.purposes.includes('dating') ? "text-web3-magenta" : "text-muted-foreground")} />
                  <h3 className="text-lg font-semibold">Dating</h3>
                  <p className="text-sm text-muted-foreground">Find romantic connections in crypto</p>
                </div>
              </div>

              <div 
                className={cn(
                  "border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105",
                  formData.purposes.includes('networking') 
                    ? "border-web3-orange bg-gradient-to-br from-web3-orange/10 to-web3-yellow/20 shadow-lg shadow-web3-orange/20" 
                    : "border-border hover:border-web3-orange hover:bg-web3-orange/5"
                )}
                onClick={() => togglePurpose('networking')}
              >
                <div className="text-center space-y-4">
                  <Users className={cn("w-12 h-12 mx-auto", formData.purposes.includes('networking') ? "text-web3-orange" : "text-muted-foreground")} />
                  <h3 className="text-lg font-semibold">Networking</h3>
                  <p className="text-sm text-muted-foreground">Build professional relationships</p>
                </div>
              </div>

              <div 
                className={cn(
                  "border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105",
                  (formData.purposes.includes('dating') && formData.purposes.includes('networking'))
                    ? "border-web3-red bg-gradient-to-br from-web3-red/10 to-web3-magenta/20 shadow-lg shadow-web3-red/20" 
                    : "border-border hover:border-web3-red hover:bg-web3-red/5"
                )}
                onClick={() => {
                  if (formData.purposes.includes('dating') && formData.purposes.includes('networking')) {
                    updateFormData({ purposes: [] });
                  } else {
                    updateFormData({ purposes: ['dating', 'networking'] });
                  }
                }}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-1">
                    <Heart className={cn("w-10 h-10", (formData.purposes.includes('dating') && formData.purposes.includes('networking')) ? "text-web3-red" : "text-muted-foreground")} />
                    <Users className={cn("w-10 h-10", (formData.purposes.includes('dating') && formData.purposes.includes('networking')) ? "text-web3-red" : "text-muted-foreground")} />
                  </div>
                  <h3 className="text-lg font-semibold">Both</h3>
                  <p className="text-sm text-muted-foreground">Open to dating and networking</p>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-r from-web3-yellow to-web3-orange px-6 py-2 text-white font-medium rounded-full border border-web3-orange">Profile Information</span>
            </div>
          </div>

          {/* Base Profile Section */}
          <section className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-web3-magenta to-web3-orange bg-clip-text text-transparent">Tell Us About Yourself</h2>
              <p className="text-muted-foreground text-lg">Share your story and crypto journey</p>
            </div>
            
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Profile Photos */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Profile Photos (2-6 photos) *</Label>
                <div className="border-2 border-dashed border-muted rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4 text-lg">Drag and drop photos or click to browse</p>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={isUploading || formData.photos.length >= 6}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="h-12 px-6"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    disabled={isUploading || formData.photos.length >= 6}
                  >
                    {isUploading ? 'Uploading...' : 'Add Photos'}
                  </Button>
                  {formData.photos.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {formData.photos.length} photo(s) added
                    </p>
                  )}
                </div>
              </div>

              {/* Birthdate */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Birthdate *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !formData.birthdate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {formData.birthdate ? format(formData.birthdate, "PPP") : "Select your birthdate"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthdate}
                      onSelect={(date) => updateFormData({ birthdate: date })}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="show-birthdate"
                    checked={formData.showBirthdate}
                    onCheckedChange={(checked) => updateFormData({ showBirthdate: !!checked })}
                  />
                  <Label htmlFor="show-birthdate" className="text-sm">
                    Show my birthdate on profile
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your age will always be displayed, but you can choose whether to show your exact birthdate
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Bio/About (500 char limit)</Label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => updateFormData({ bio: e.target.value.slice(0, 500) })}
                  className="min-h-[120px] text-base"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/500
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Current Location *</Label>
                <Input
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="text-base h-12"
                />
              </div>

              {/* Social Media Verification Section */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Social Media Verification</h3>
                  <p className="text-muted-foreground">Connect your social accounts to build trust and verify your identity</p>
                </div>
                <SocialMediaConnections user={user} />
              </div>

              {/* NFT Collection Showcase */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold text-purple-600">NFT Collection Showcase 🎨</h3>
                <p className="text-muted-foreground">Show off your digital art collection</p>
                
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">NFT Collections Owned</Label>
                  <Input
                    placeholder="Bored Ape Yacht Club, CryptoPunks, Azuki, Art Blocks..."
                    value={formData.nftCollections || ''}
                    onChange={(e) => updateFormData({ nftCollections: e.target.value })}
                    className="text-base h-12"
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple collections with commas</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Showcase NFT Images</Label>
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                    <p className="text-muted-foreground mb-3">Upload your favorite NFT images</p>
                    <Input
                      id="nft-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNFTUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="h-10 px-4 border-purple-300 text-purple-600 hover:bg-purple-50"
                      onClick={() => document.getElementById('nft-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload NFT Images'}
                    </Button>
                    {formData.nftImages?.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {formData.nftImages.length} NFT image(s) added
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Meme Collection */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-xl font-bold text-orange-600">Meme Collection 😂</h3>
                <p className="text-muted-foreground">Share your crypto sense of humor</p>
                
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Favorite Crypto Memes</Label>
                  <Textarea
                    placeholder="Diamond hands 💎🙌, To the moon 🚀, This is fine 🔥, Number go up 📈, HODL..."
                    value={formData.favoriteMemesText || ''}
                    onChange={(e) => updateFormData({ favoriteMemesText: e.target.value })}
                    className="min-h-[100px] text-base"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">Describe your favorite crypto memes or inside jokes</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Upload Funny Meme Pics</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                    <p className="text-muted-foreground mb-3">Upload your favorite crypto meme images</p>
                    <Input
                      id="meme-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMemeUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="h-10 px-4 border-orange-300 text-orange-600 hover:bg-orange-50"
                      onClick={() => document.getElementById('meme-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Meme Images'}
                    </Button>
                    {formData.favoriteMemesImages?.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {formData.favoriteMemesImages.length} meme image(s) added
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Meme Coin Holdings</Label>
                  <Input
                    placeholder="DOGE, SHIB, PEPE, WIF, BONK, FLOKI..."
                    value={formData.memeCoinHoldings}
                    onChange={(e) => updateFormData({ memeCoinHoldings: e.target.value })}
                    className="text-base h-12"
                  />
                </div>
              </div>

              {/* Comprehensive Crypto Profile */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Crypto Profile</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Crypto Experience *</Label>
                    <Select value={formData.cryptoExperience} onValueChange={(value) => updateFormData({ cryptoExperience: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newbie">Crypto Newbie (&lt; 6 months)</SelectItem>
                        <SelectItem value="beginner">Beginner (6 months - 1 year)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="veteran">Veteran (5+ years)</SelectItem>
                        <SelectItem value="og">OG (Since 2017 or earlier)</SelectItem>
                        <SelectItem value="degen">Full Degen (YOLO everything)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Years in Crypto</Label>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      placeholder="5"
                      value={formData.yearsInCrypto || ''}
                      onChange={(e) => updateFormData({ yearsInCrypto: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Favorite Crypto *</Label>
                    <Select value={formData.favoriteCrypto} onValueChange={(value) => updateFormData({ favoriteCrypto: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select favorite crypto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bitcoin (BTC)">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="Ethereum (ETH)">Ethereum (ETH)</SelectItem>
                        <SelectItem value="Solana (SOL)">Solana (SOL)</SelectItem>
                        <SelectItem value="Cardano (ADA)">Cardano (ADA)</SelectItem>
                        <SelectItem value="Polygon (MATIC)">Polygon (MATIC)</SelectItem>
                        <SelectItem value="Chainlink (LINK)">Chainlink (LINK)</SelectItem>
                        <SelectItem value="Dogecoin (DOGE)">Dogecoin (DOGE)</SelectItem>
                        <SelectItem value="Shiba Inu (SHIB)">Shiba Inu (SHIB)</SelectItem>
                        <SelectItem value="Avalanche (AVAX)">Avalanche (AVAX)</SelectItem>
                        <SelectItem value="Polkadot (DOT)">Polkadot (DOT)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Portfolio Size</Label>
                    <Select value={formData.portfolioSize} onValueChange={(value) => updateFormData({ portfolioSize: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select portfolio size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Shrimp (< $1k)">Shrimp (&lt; $1k)</SelectItem>
                        <SelectItem value="Crab ($1k - $10k)">Crab ($1k - $10k)</SelectItem>
                        <SelectItem value="Fish ($10k - $50k)">Fish ($10k - $50k)</SelectItem>
                        <SelectItem value="Dolphin ($50k - $500k)">Dolphin ($50k - $500k)</SelectItem>
                        <SelectItem value="Shark ($500k - $1M)">Shark ($500k - $1M)</SelectItem>
                        <SelectItem value="Whale ($1M+) 🐋">Whale ($1M+) 🐋</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Trading Style</Label>
                    <Select value={formData.tradingStyle} onValueChange={(value) => updateFormData({ tradingStyle: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select trading style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HODL only">HODL only</SelectItem>
                        <SelectItem value="DCA (Dollar Cost Average)">DCA (Dollar Cost Average)</SelectItem>
                        <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                        <SelectItem value="Day Trading">Day Trading</SelectItem>
                        <SelectItem value="Scalping">Scalping</SelectItem>
                        <SelectItem value="Copy Trading">Copy Trading</SelectItem>
                        <SelectItem value="Ape into everything">Ape into everything</SelectItem>
                        <SelectItem value="Research first, then invest">Research first, then invest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Degen Score (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="8"
                      value={formData.degenScore || ''}
                      onChange={(e) => updateFormData({ degenScore: e.target.value })}
                      className="text-base h-12"
                    />
                    <p className="text-sm text-muted-foreground">1 = Conservative, 10 = Full Degen</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Biggest Crypto Win 🏆</Label>
                    <Input
                      placeholder="Got ETH at $200, 100x on SHIB..."
                      value={formData.biggestWin}
                      onChange={(e) => updateFormData({ biggestWin: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Biggest Crypto Loss 💸</Label>
                    <Input
                      placeholder="LUNA collapse, bought ICP at $700..."
                      value={formData.biggestLoss}
                      onChange={(e) => updateFormData({ biggestLoss: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">DeFi Protocols</Label>
                  <Input
                    placeholder="Uniswap, Compound, Aave, MakerDAO, Curve..."
                    value={formData.defiProtocolsText || ''}
                    onChange={(e) => updateFormData({ defiProtocolsText: e.target.value })}
                    className="text-base h-12"
                  />
                  <p className="text-sm text-muted-foreground">List DeFi protocols you use, separated by commas</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Crypto Motto</Label>
                  <Textarea
                    placeholder="Diamond hands forever, WAGMI, Not financial advice..."
                    value={formData.cryptoMotto || ''}
                    onChange={(e) => updateFormData({ cryptoMotto: e.target.value })}
                    className="min-h-[80px] text-base"
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Investment Philosophy</Label>
                  <Textarea
                    placeholder="If you're not building at 2AM, you're not building. DeFi is the future..."
                    value={formData.investmentPhilosophy}
                    onChange={(e) => updateFormData({ investmentPhilosophy: e.target.value })}
                    className="min-h-[100px] text-base"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Dating Section */}
          {isDatingEnabled && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-pink-200 dark:border-pink-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-6 py-2 text-pink-600 font-medium rounded-full border border-pink-200 dark:border-pink-800">Dating Profile</span>
                </div>
              </div>

              <section className="space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-pink-600">
                    <Heart className="w-8 h-8" />
                    Dating Profile
                  </h2>
                  <p className="text-muted-foreground text-lg">Help us find your perfect crypto match</p>
                </div>

                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Gender Identity *</Label>
                      <Select value={formData.genderIdentity} onValueChange={(value) => updateFormData({ genderIdentity: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select gender identity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="man">Man</SelectItem>
                          <SelectItem value="woman">Woman</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="transgender-man">Transgender Man</SelectItem>
                          <SelectItem value="transgender-woman">Transgender Woman</SelectItem>
                          <SelectItem value="genderfluid">Genderfluid</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Sexual Orientation *</Label>
                      <Select value={formData.sexualOrientation} onValueChange={(value) => updateFormData({ sexualOrientation: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="gay">Gay</SelectItem>
                          <SelectItem value="lesbian">Lesbian</SelectItem>
                          <SelectItem value="bisexual">Bisexual</SelectItem>
                          <SelectItem value="pansexual">Pansexual</SelectItem>
                          <SelectItem value="asexual">Asexual</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Relationship Type *</Label>
                    <Select value={formData.relationshipType} onValueChange={(value) => updateFormData({ relationshipType: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="What are you looking for?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual dating</SelectItem>
                        <SelectItem value="serious">Serious relationship</SelectItem>
                        <SelectItem value="marriage">Marriage</SelectItem>
                        <SelectItem value="friends-benefits">Friends with benefits</SelectItem>
                        <SelectItem value="friends">Just friends</SelectItem>
                        <SelectItem value="open">Open to anything</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-pink-600">Dating-Specific Crypto Questions</h3>
                    
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Would you go on a crypto-themed date?</Label>
                      <Select value={formData.cryptoDatePreference} onValueChange={(value) => updateFormData({ cryptoDatePreference: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="maybe">Maybe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Ideal first date in crypto world?</Label>
                      <Input
                        placeholder="NFT gallery opening, DeFi workshop, etc."
                        value={formData.idealCryptoDate}
                        onChange={(e) => updateFormData({ idealCryptoDate: e.target.value })}
                        className="text-base h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Deal breaker in crypto?</Label>
                      <Input
                        placeholder="Paper hands, rug pulls, etc."
                        value={formData.cryptoDealBreaker}
                        onChange={(e) => updateFormData({ cryptoDealBreaker: e.target.value })}
                        className="text-base h-12"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Networking Section */}
          {isNetworkingEnabled && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-blue-200 dark:border-blue-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-6 py-2 text-blue-600 font-medium rounded-full border border-blue-200 dark:border-blue-800">Networking Profile</span>
                </div>
              </div>

              <section className="space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold flex items-center justify-center gap-3 text-blue-600">
                    <Users className="w-8 h-8" />
                    Networking Profile
                  </h2>
                  <p className="text-muted-foreground text-lg">Build your professional crypto network</p>
                </div>

                <div className="space-y-8 max-w-3xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Current Role/Title *</Label>
                      <Input
                        placeholder="Software Engineer, Founder, etc."
                        value={formData.currentRole}
                        onChange={(e) => updateFormData({ currentRole: e.target.value })}
                        className="text-base h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData({ industry: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defi">DeFi</SelectItem>
                          <SelectItem value="nfts">NFTs</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="content">Content Creation</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="investing">Investing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Work Status *</Label>
                    <Select value={formData.workStatus} onValueChange={(value) => updateFormData({ workStatus: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="What's your current focus?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="looking-for-work">Looking for work</SelectItem>
                        <SelectItem value="looking-to-hire">Looking to hire</SelectItem>
                        <SelectItem value="both">Both - Open to opportunities and hiring</SelectItem>
                        <SelectItem value="neither">Neither - Just networking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Company/Project</Label>
                    <Input
                      placeholder="Your current company or project"
                      value={formData.company}
                      onChange={(e) => updateFormData({ company: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>

                   {/* Resume Upload */}
                   <div className="space-y-6">
                     <div className="space-y-3">
                       <Label className="text-lg font-semibold">Resume Upload</Label>
                       <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                         <input
                           type="file"
                           accept=".pdf"
                           onChange={handleResumeUpload}
                           className="hidden"
                           id="resume-upload"
                           disabled={isUploading}
                         />
                         <label
                           htmlFor="resume-upload"
                           className="cursor-pointer flex flex-col items-center gap-4"
                         >
                           <Upload className="w-12 h-12 text-blue-500" />
                           <div className="space-y-2">
                             <p className="text-lg font-medium text-blue-600">
                               {formData.resume ? `📄 ${formData.resume.name}` : 'Upload Your Resume'}
                             </p>
                             <p className="text-sm text-muted-foreground">
                               PDF only, max 5MB
                             </p>
                           </div>
                         </label>
                       </div>
                       {formData.resume && (
                         <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                           <span className="text-sm text-blue-700 dark:text-blue-300">
                             📄 {formData.resume.name}
                           </span>
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={() => updateFormData({ resume: undefined })}
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                       )}
                     </div>
                   </div>

                   {/* Projects */}
                   <div className="space-y-6">
                     <div className="flex items-center justify-between">
                       <Label className="text-lg font-semibold">Project Showcase</Label>
                       <Button
                         type="button"
                         variant="outline"
                         onClick={addProject}
                         className="flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" />
                         Add Project
                       </Button>
                     </div>
                     
                     {formData.projects.map((project, index) => (
                       <div key={index} className="border rounded-xl p-6 space-y-4">
                         <div className="flex items-center justify-between">
                           <Label className="text-base font-medium">Project {index + 1}</Label>
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={() => removeProject(index)}
                           >
                             <X className="w-4 h-4" />
                           </Button>
                         </div>
                         
                         <div className="space-y-4">
                           <Input
                             placeholder="Project name"
                             value={project.name}
                             onChange={(e) => updateProject(index, { name: e.target.value })}
                             className="text-base"
                           />
                           <Textarea
                             placeholder="Project description"
                             value={project.description}
                             onChange={(e) => updateProject(index, { description: e.target.value })}
                             rows={3}
                             className="text-base"
                           />
                           <Input
                             placeholder="Project link (optional)"
                             value={project.link}
                             onChange={(e) => updateProject(index, { link: e.target.value })}
                             className="text-base"
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </section>
            </>
          )}

          {/* Privacy Settings */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-6 py-2 text-muted-foreground font-medium rounded-full border">Privacy Settings</span>
            </div>
          </div>

          <section className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Privacy Settings</h2>
              <p className="text-muted-foreground text-lg">Control who can see and interact with your profile</p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {isDatingEnabled && (
                <div className="flex items-center justify-between p-6 border rounded-xl">
                  <div>
                    <Label className="text-lg font-semibold">Show me in dating pool</Label>
                    <p className="text-sm text-muted-foreground">Allow others to discover you for dating</p>
                  </div>
                  <Switch
                    checked={formData.showInDatingPool}
                    onCheckedChange={(checked) => updateFormData({ showInDatingPool: checked })}
                  />
                </div>
              )}

              {isNetworkingEnabled && (
                <div className="flex items-center justify-between p-6 border rounded-xl">
                  <div>
                    <Label className="text-lg font-semibold">Show me in networking pool</Label>
                    <p className="text-sm text-muted-foreground">Allow others to discover you for networking</p>
                  </div>
                  <Switch
                    checked={formData.showInNetworkingPool}
                    onCheckedChange={(checked) => updateFormData({ showInNetworkingPool: checked })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-6 border rounded-xl">
                <div>
                  <Label className="text-lg font-semibold">Make profile public</Label>
                  <p className="text-sm text-muted-foreground">Your profile will be visible to all users</p>
                </div>
                <Switch
                  checked={formData.makeProfilePublic}
                  onCheckedChange={(checked) => updateFormData({ makeProfilePublic: checked })}
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center pt-12">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || formData.purposes.length === 0}
              className="text-xl px-12 py-6 h-16 bg-gradient-web3 hover:scale-105 transition-all text-white font-bold shadow-lg"
            >
              {isSubmitting ? "Creating Profile..." : getSubmitButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveProfileForm;
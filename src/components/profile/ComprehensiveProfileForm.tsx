import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      // Auto-save logic would go here
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

  const toggleArrayItem = (array: string[], item: string, field: keyof FormData) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFormData({ [field]: newArray });
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-yellow via-web3-orange to-web3-red bg-clip-text text-transparent">
          Complete Your Boink Profile
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us about yourself to connect with the right crypto community members
        </p>
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </div>

      {/* Purpose Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Rocket className="w-6 h-6 text-web3-orange" />
            What brings you to Boink?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div 
              className={cn(
                "border-2 rounded-lg p-6 cursor-pointer transition-all",
                formData.purposes.includes('dating') 
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-950" 
                  : "border-muted hover:border-pink-300"
              )}
              onClick={() => togglePurpose('dating')}
            >
              <div className="text-center space-y-3">
                <Heart className={cn("w-8 h-8 mx-auto", formData.purposes.includes('dating') ? "text-pink-500" : "text-muted-foreground")} />
                <h3 className="font-semibold">Dating</h3>
                <p className="text-sm text-muted-foreground">Find romantic connections in crypto</p>
              </div>
            </div>

            <div 
              className={cn(
                "border-2 rounded-lg p-6 cursor-pointer transition-all",
                formData.purposes.includes('networking') 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                  : "border-muted hover:border-blue-300"
              )}
              onClick={() => togglePurpose('networking')}
            >
              <div className="text-center space-y-3">
                <Users className={cn("w-8 h-8 mx-auto", formData.purposes.includes('networking') ? "text-blue-500" : "text-muted-foreground")} />
                <h3 className="font-semibold">Networking</h3>
                <p className="text-sm text-muted-foreground">Build professional relationships</p>
              </div>
            </div>

            <div 
              className={cn(
                "border-2 rounded-lg p-6 cursor-pointer transition-all",
                (formData.purposes.includes('dating') && formData.purposes.includes('networking'))
                  ? "border-web3-orange bg-orange-50 dark:bg-orange-950" 
                  : "border-muted hover:border-orange-300"
              )}
              onClick={() => {
                if (formData.purposes.includes('dating') && formData.purposes.includes('networking')) {
                  updateFormData({ purposes: [] });
                } else {
                  updateFormData({ purposes: ['dating', 'networking'] });
                }
              }}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Heart className={cn("w-6 h-6", (formData.purposes.includes('dating') && formData.purposes.includes('networking')) ? "text-web3-orange" : "text-muted-foreground")} />
                  <Users className={cn("w-6 h-6", (formData.purposes.includes('dating') && formData.purposes.includes('networking')) ? "text-web3-orange" : "text-muted-foreground")} />
                </div>
                <h3 className="font-semibold">Both</h3>
                <p className="text-sm text-muted-foreground">Open to dating and networking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Base Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Base Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photos */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Profile Photos (2-6 photos) *</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Drag and drop photos or click to browse</p>
              <Button variant="outline">
                Add Photos
              </Button>
              {formData.photos.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.photos.length} photo(s) added
                </p>
              )}
            </div>
          </div>

          {/* Birthdate */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Birthdate *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.birthdate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
            <div className="flex items-center space-x-2">
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
          <div className="space-y-2">
            <Label className="text-base font-medium">Bio/About (500 char limit)</Label>
            <Textarea
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => updateFormData({ bio: e.target.value.slice(0, 500) })}
              className="min-h-[100px]"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Current Location *</Label>
            <Input
              placeholder="City, State/Country"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
            />
          </div>

          {/* Crypto Experience */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Crypto Experience *</Label>
              <Select value={formData.cryptoExperience} onValueChange={(value) => updateFormData({ cryptoExperience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Favorite Crypto/Token</Label>
              <Select value={formData.favoriteCrypto} onValueChange={(value) => updateFormData({ favoriteCrypto: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select favorite crypto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Investment Philosophy */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Investment Philosophy</Label>
            <Textarea
              placeholder="If you're not building at 2AM, you're not building."
              value={formData.investmentPhilosophy}
              onChange={(e) => updateFormData({ investmentPhilosophy: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dating Section */}
      {isDatingEnabled && (
        <Card className="border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Dating Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Gender Identity *</Label>
                <Select value={formData.genderIdentity} onValueChange={(value) => updateFormData({ genderIdentity: value })}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label className="text-base font-medium">Sexual Orientation *</Label>
                <Select value={formData.sexualOrientation} onValueChange={(value) => updateFormData({ sexualOrientation: value })}>
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label className="text-base font-medium">Relationship Type *</Label>
              <Select value={formData.relationshipType} onValueChange={(value) => updateFormData({ relationshipType: value })}>
                <SelectTrigger>
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

            <div className="space-y-4">
              <h4 className="font-medium">Dating-Specific Crypto Questions</h4>
              <div className="space-y-2">
                <Label>Would you go on a crypto-themed date?</Label>
                <Select value={formData.cryptoDatePreference} onValueChange={(value) => updateFormData({ cryptoDatePreference: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ideal first date in crypto world?</Label>
                <Input
                  placeholder="NFT gallery opening, DeFi workshop, etc."
                  value={formData.idealCryptoDate}
                  onChange={(e) => updateFormData({ idealCryptoDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Deal breaker in crypto?</Label>
                <Input
                  placeholder="Paper hands, rug pulls, etc."
                  value={formData.cryptoDealBreaker}
                  onChange={(e) => updateFormData({ cryptoDealBreaker: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Networking Section */}
      {isNetworkingEnabled && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Networking Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Current Role/Title *</Label>
                <Input
                  placeholder="Software Engineer, Founder, etc."
                  value={formData.currentRole}
                  onChange={(e) => updateFormData({ currentRole: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData({ industry: value })}>
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label className="text-base font-medium">Company/Project</Label>
              <Input
                placeholder="Your current company or project"
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
              />
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Project Showcase</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>
              
              {formData.projects.map((project, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Project {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-3">
                      <Input
                        placeholder="Project name"
                        value={project.name}
                        onChange={(e) => updateProject(index, { name: e.target.value })}
                      />
                      <Textarea
                        placeholder="Project description"
                        value={project.description}
                        onChange={(e) => updateProject(index, { description: e.target.value })}
                        rows={2}
                      />
                      <Input
                        placeholder="Project link (optional)"
                        value={project.link}
                        onChange={(e) => updateProject(index, { link: e.target.value })}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDatingEnabled && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Show me in dating pool</Label>
                <p className="text-sm text-muted-foreground">Allow others to discover you for dating</p>
              </div>
              <Switch
                checked={formData.showInDatingPool}
                onCheckedChange={(checked) => updateFormData({ showInDatingPool: checked })}
              />
            </div>
          )}

          {isNetworkingEnabled && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Show me in networking pool</Label>
                <p className="text-sm text-muted-foreground">Allow others to discover you for networking</p>
              </div>
              <Switch
                checked={formData.showInNetworkingPool}
                onCheckedChange={(checked) => updateFormData({ showInNetworkingPool: checked })}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Make profile public</Label>
              <p className="text-sm text-muted-foreground">Your profile will be visible to all users</p>
            </div>
            <Switch
              checked={formData.makeProfilePublic}
              onCheckedChange={(checked) => updateFormData({ makeProfilePublic: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center pt-8">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || formData.purposes.length === 0}
          size="lg"
          className="text-lg px-8 py-6 bg-gradient-to-r from-web3-yellow via-web3-orange to-web3-red hover:from-web3-orange hover:via-web3-red hover:to-web3-magenta"
        >
          {isSubmitting ? "Creating Profile..." : getSubmitButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default ComprehensiveProfileForm;
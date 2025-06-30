
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  EyeOff, 
  Eye, 
  EyeIcon, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileQualityScore } from '@/utils/profileQualityUtils';

interface TieredProfileWarningProps {
  quality: ProfileQualityScore;
  showButton?: boolean;
  className?: string;
}

const TieredProfileWarning = ({ quality, showButton = true, className = "" }: TieredProfileWarningProps) => {
  const navigate = useNavigate();

  const handleImproveProfile = () => {
    navigate('/profile');
  };

  const getAlertConfig = () => {
    switch (quality.visibilityStatus) {
      case 'invisible':
        return {
          icon: <EyeOff className="h-6 w-6 text-red-600" />,
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950',
          titleColor: 'text-red-800 dark:text-red-200',
          descColor: 'text-red-700 dark:text-red-300',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          title: '🚫 You\'re Invisible in Discovery',
          badge: 'Invisible',
          badgeColor: 'bg-red-500'
        };
      case 'limited':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          borderColor: 'border-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-950',
          titleColor: 'text-orange-800 dark:text-orange-200',
          descColor: 'text-orange-700 dark:text-orange-300',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          title: '⚠️ Limited Visibility in Discovery',
          badge: 'Limited',
          badgeColor: 'bg-orange-500'
        };
      case 'good':
        return {
          icon: <Eye className="h-6 w-6 text-blue-600" />,
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          titleColor: 'text-blue-800 dark:text-blue-200',
          descColor: 'text-blue-700 dark:text-blue-300',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          title: '👍 Good Profile Visibility',
          badge: 'Good',
          badgeColor: 'bg-blue-500'
        };
      case 'excellent':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950',
          titleColor: 'text-green-800 dark:text-green-200',
          descColor: 'text-green-700 dark:text-green-300',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          title: '🎉 Excellent Profile!',
          badge: 'Excellent',
          badgeColor: 'bg-green-500'
        };
    }
  };

  const config = getAlertConfig();

  const getDescription = () => {
    switch (quality.visibilityStatus) {
      case 'invisible':
        return (
          <div>
            <div className="mb-3">
              <strong>You won't appear in discovery</strong> until you add more basic information.
              {quality.missingCritical.length > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Missing critical info:</strong> {quality.missingCritical.join(', ')}
                </div>
              )}
            </div>
            <div className="text-sm">
              ❌ Not visible to other users<br/>
              ❌ No matches possible<br/>
              ❌ Profile incomplete
            </div>
          </div>
        );
      case 'limited':
        return (
          <div>
            <div className="mb-3">
              <strong>You have basic visibility</strong> but adding more info will get you better matches.
              {quality.missingCritical.length > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Still missing:</strong> {quality.missingCritical.join(', ')}
                </div>
              )}
            </div>
            <div className="text-sm">
              ⚠️ Limited visibility to other users<br/>
              ⚠️ Basic matching possible<br/>
              ✅ Profile partially complete
            </div>
          </div>
        );
      case 'good':
        return (
          <div>
            <div className="mb-3">
              <strong>You're visible with good matching potential!</strong> Add a few more details for even better results.
            </div>
            <div className="text-sm">
              ✅ Visible to other users<br/>
              ✅ Good matching algorithm<br/>
              ✅ Profile well-developed
            </div>
          </div>
        );
      case 'excellent':
        return (
          <div>
            <div className="mb-3">
              <strong>Perfect! You have maximum visibility and matching potential.</strong>
            </div>
            <div className="text-sm">
              ✅ Maximum visibility<br/>
              ✅ Excellent matching algorithm<br/>
              ✅ Complete profile optimized for matches
            </div>
          </div>
        );
    }
  };

  // Don't show warning for excellent profiles
  if (quality.visibilityStatus === 'excellent') {
    return null;
  }

  return (
    <Alert className={`${config.borderColor} ${config.bgColor} ${className}`}>
      {config.icon}
      <AlertTitle className={`${config.titleColor} text-xl font-bold flex items-center gap-2`}>
        {config.title}
        <Badge className={`${config.badgeColor} text-white`}>
          {config.badge}
        </Badge>
      </AlertTitle>
      <AlertDescription className={`${config.descColor} mt-2`}>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Profile Quality</span>
            <span className="font-bold">{quality.percentage}%</span>
          </div>
          <Progress value={quality.percentage} className="h-3" />
        </div>
        
        {getDescription()}
        
        {showButton && quality.visibilityStatus !== 'excellent' && (
          <Button 
            onClick={handleImproveProfile}
            className={`${config.buttonColor} text-white font-semibold mt-3`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Improve My Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default TieredProfileWarning;

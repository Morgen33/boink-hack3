import { CheckCircle, Building, User, Target, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NetworkingReviewStepProps {
  data: any;
}

const NetworkingReviewStep = ({ data }: NetworkingReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Your Professional Profile</h3>
        <p className="text-muted-foreground">
          Make sure everything looks good before joining the professional network
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="font-medium">{data.full_name || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Job Title</p>
              <p className="font-medium">{data.job_title || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p className="font-medium">{data.company_name || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Industry</p>
              <p className="font-medium">{data.industry || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Years in Web3</p>
              <p className="font-medium">
                {data.years_in_crypto === '0' ? 'Just getting started' : 
                 data.years_in_crypto === '10' ? '10+ years (OG)' :
                 data.years_in_crypto ? `${data.years_in_crypto} years` : 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.professional_bio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Professional Bio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.professional_bio}</p>
          </CardContent>
        </Card>
      )}

      {data.expertise_areas && data.expertise_areas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Areas of Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.expertise_areas.map((area: string) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.networking_goals && data.networking_goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Networking Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.networking_goals.map((goal: string) => (
                <Badge key={goal} variant="outline">
                  {goal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.looking_for_networking && data.looking_for_networking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Looking to Connect With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.looking_for_networking.map((type: string) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(data.linkedin_url || data.website_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.linkedin_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
                <p className="text-sm text-blue-600 hover:underline">
                  <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer">
                    {data.linkedin_url}
                  </a>
                </p>
              </div>
            )}
            {data.website_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="text-sm text-blue-600 hover:underline">
                  <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                    {data.website_url}
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NetworkingReviewStep;
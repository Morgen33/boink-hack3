
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Coins, Users, Target } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  breakdown: {
    genderMatch: number;
    ageCompatibility: number;
    locationScore: number;
    interestMatch: number;
    cryptoCompatibility: number;
    relationshipMatch: number;
  };
}

const MatchScore = ({ score, breakdown }: MatchScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Low';
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Compatibility Score
          </h3>
          <Badge variant="secondary" className={getScoreColor(score)}>
            {Math.round(score * 100)}% {getScoreLabel(score)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              Gender Match
            </span>
            <span className={getScoreColor(breakdown.genderMatch)}>
              {Math.round(breakdown.genderMatch * 100)}%
            </span>
          </div>
          <Progress value={breakdown.genderMatch * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Age Compatibility
            </span>
            <span className={getScoreColor(breakdown.ageCompatibility)}>
              {Math.round(breakdown.ageCompatibility * 100)}%
            </span>
          </div>
          <Progress value={breakdown.ageCompatibility * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Location
            </span>
            <span className={getScoreColor(breakdown.locationScore)}>
              {Math.round(breakdown.locationScore * 100)}%
            </span>
          </div>
          <Progress value={breakdown.locationScore * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Heart className="w-3 h-3" />
              Shared Interests
            </span>
            <span className={getScoreColor(breakdown.interestMatch)}>
              {Math.round(breakdown.interestMatch * 100)}%
            </span>
          </div>
          <Progress value={breakdown.interestMatch * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Coins className="w-3 h-3" />
              Crypto Compatibility
            </span>
            <span className={getScoreColor(breakdown.cryptoCompatibility)}>
              {Math.round(breakdown.cryptoCompatibility * 100)}%
            </span>
          </div>
          <Progress value={breakdown.cryptoCompatibility * 100} className="h-2" />

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              Relationship Goals
            </span>
            <span className={getScoreColor(breakdown.relationshipMatch)}>
              {Math.round(breakdown.relationshipMatch * 100)}%
            </span>
          </div>
          <Progress value={breakdown.relationshipMatch * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchScore;

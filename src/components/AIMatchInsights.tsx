import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { useAIMatching } from '@/hooks/useAIMatching';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface AIMatchInsightsProps {
  targetUserId: string;
  compatibilityScore?: number;
  onStartConversation?: () => void;
}

const AIMatchInsights: React.FC<AIMatchInsightsProps> = ({ 
  targetUserId, 
  compatibilityScore,
  onStartConversation 
}) => {
  const { user } = useSimpleAuth();
  const { getMatchInsights, calculateCompatibility, loading } = useAIMatching();
  const [insights, setInsights] = useState<any>(null);
  const [aiScore, setAiScore] = useState<number | null>(compatibilityScore || null);

  useEffect(() => {
    const loadInsights = async () => {
      if (!user) return;

      try {
        // Get existing insights
        const existingInsights = await getMatchInsights(user.id, targetUserId);
        
        if (existingInsights) {
          setInsights(existingInsights);
          setAiScore(existingInsights.ai_confidence);
        } else {
          // Calculate new compatibility if none exists
          const compatibilityData = await calculateCompatibility(user.id, targetUserId);
          if (compatibilityData?.insights) {
            setInsights(compatibilityData.insights);
            setAiScore(compatibilityData.compatibilityScore);
          }
        }
      } catch (error) {
        console.error('Error loading AI insights:', error);
      }
    };

    loadInsights();
  }, [user, targetUserId]);

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 animate-pulse text-primary" />
            <span>AI is analyzing compatibility...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI analysis will appear here</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = aiScore && aiScore >= 0.8 ? 'text-green-600' : 
                   aiScore && aiScore >= 0.6 ? 'text-yellow-600' : 'text-blue-600';
  
  const scoreLabel = aiScore && aiScore >= 0.8 ? 'Excellent Match' :
                    aiScore && aiScore >= 0.6 ? 'Good Match' : 'Potential Match';

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          AI Compatibility Insights
          {aiScore && (
            <Badge variant="secondary" className={`ml-auto ${scoreColor} bg-white/80`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {Math.round(aiScore * 100)}% {scoreLabel}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main compatibility explanation */}
        <div className="p-3 rounded-lg bg-white/50 border border-primary/10">
          <p className="text-sm text-foreground leading-relaxed">
            {insights.compatibility_explanation}
          </p>
        </div>

        {/* Personality highlights */}
        {insights.personality_highlights && (
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 mt-0.5 text-pink-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Personality Match
              </p>
              <p className="text-sm text-foreground">
                {insights.personality_highlights}
              </p>
            </div>
          </div>
        )}

        {/* Crypto common ground */}
        {insights.crypto_common_ground && (
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Crypto Connection
              </p>
              <p className="text-sm text-foreground">
                {insights.crypto_common_ground}
              </p>
            </div>
          </div>
        )}

        {/* Shared interests */}
        {insights.shared_interests && insights.shared_interests.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Shared Interests
            </p>
            <div className="flex flex-wrap gap-1">
              {insights.shared_interests.slice(0, 4).map((interest: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/5">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Conversation starters */}
        {insights.conversation_starters && insights.conversation_starters.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Conversation Starters
            </p>
            <div className="space-y-2">
              {insights.conversation_starters.slice(0, 2).map((starter: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/10">
                  <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-xs text-foreground">{starter}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        {onStartConversation && (
          <Button 
            onClick={onStartConversation}
            className="w-full mt-4 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Conversation
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchInsights;
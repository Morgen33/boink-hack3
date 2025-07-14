import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Brain, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';
import { useAIMatching } from '@/hooks/useAIMatching';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AIProfileAnalysisProps {
  profileData?: any;
  onAnalysisComplete?: () => void;
}

const AIProfileAnalysis: React.FC<AIProfileAnalysisProps> = ({ 
  profileData,
  onAnalysisComplete 
}) => {
  const { user } = useSimpleAuth();
  const { analyzeProfile, loading } = useAIMatching();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const checkForExistingAnalysis = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profile_embeddings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setAnalysisData(data);
          setHasAnalysis(true);
        }
      } catch (error) {
        console.error('Error checking for existing analysis:', error);
      }
    };

    checkForExistingAnalysis();
  }, [user]);

  const handleAnalyzeProfile = async () => {
    if (!user || !profileData) return;

    try {
      await analyzeProfile({
        userId: user.id,
        bio: profileData.bio,
        interests: profileData.interests,
        cryptoExperience: profileData.crypto_experience,
        favoriteCrypto: profileData.favorite_crypto,
        tradingStyle: profileData.trading_style,
        cryptoMotto: profileData.crypto_motto,
      });

      // Refresh analysis data
      const { data } = await supabase
        .from('profile_embeddings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setAnalysisData(data);
        setHasAnalysis(true);
        onAnalysisComplete?.();
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
    }
  };

  const getPersonalityInsights = () => {
    if (!analysisData?.personality_traits) return null;

    const traits = analysisData.personality_traits;
    return [
      { 
        name: 'Openness', 
        value: Math.round(traits.openness * 100), 
        description: 'Creativity and curiosity' 
      },
      { 
        name: 'Risk Tolerance', 
        value: Math.round(traits.risk_tolerance * 100), 
        description: 'Comfort with investment risk' 
      },
      { 
        name: 'Extraversion', 
        value: Math.round(traits.extraversion * 100), 
        description: 'Social energy and communication' 
      },
      { 
        name: 'Agreeableness', 
        value: Math.round(traits.agreeableness * 100), 
        description: 'Cooperation and trust' 
      },
    ];
  };

  if (!user) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500">
            <Brain className="w-4 h-4 text-white" />
          </div>
          AI Profile Analysis
          <Badge variant={hasAnalysis ? "default" : "secondary"} className="ml-auto">
            {hasAnalysis ? "Complete" : "Pending"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasAnalysis ? (
          <div className="text-center py-6">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary/60" />
            <h3 className="font-semibold mb-2">Unlock AI-Powered Matching</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Let our AI analyze your profile to find better matches and provide personalized insights.
            </p>
            <Button 
              onClick={handleAnalyzeProfile}
              disabled={loading || !profileData}
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze My Profile
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Communication Style */}
            {analysisData.communication_style && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-primary/10">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Communication Style</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {analysisData.communication_style}
                  </p>
                </div>
              </div>
            )}

            {/* Investment Philosophy */}
            {analysisData.personality_traits?.investment_philosophy && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-primary/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Investment Approach</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {analysisData.personality_traits.investment_philosophy}
                  </p>
                </div>
              </div>
            )}

            {/* Personality Traits */}
            {getPersonalityInsights() && (
              <div>
                <h4 className="text-sm font-medium mb-3">Personality Insights</h4>
                <div className="space-y-3">
                  {getPersonalityInsights()?.map((trait, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{trait.name}</span>
                        <span className="text-xs text-muted-foreground">{trait.value}%</span>
                      </div>
                      <Progress value={trait.value} className="h-2" />
                      <p className="text-xs text-muted-foreground">{trait.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crypto Philosophy */}
            {analysisData.crypto_philosophy && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
                <p className="text-sm font-medium mb-1">Your Crypto Philosophy</p>
                <p className="text-xs text-muted-foreground">
                  {analysisData.crypto_philosophy}
                </p>
              </div>
            )}

            <Button 
              onClick={handleAnalyzeProfile}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Update Analysis
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIProfileAnalysis;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersonalityType } from './types';
import { ShareButtons } from './ShareButtons';

interface PersonalityResultsProps {
  result: PersonalityType;
  onRetake: () => void;
}

export const PersonalityResults = ({ result, onRetake }: PersonalityResultsProps) => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <img 
          src={result.avatarImage} 
          alt={result.name}
          className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 mb-4 object-cover"
        />
        <div className="text-6xl mb-4">{result.emoji}</div>
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        {result.name}
      </h1>
      <p className="text-lg text-gray-300 mb-6">{result.description}</p>
      
      <ShareButtons result={result} onRetake={onRetake} />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-400">Your Traits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.traits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-cyan-400">Compatible With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.compatibility.map((comp, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {comp}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meme Gallery */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-yellow-400">🎭 Your Meme Energy Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {result.memeGallery.map((meme, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
                <img 
                  src={meme} 
                  alt={`Meme ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold mb-4 text-center">🎯 Your Meme Energy in Action</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-gray-400">Market Moves</div>
              <div className="text-xs">{result.traits[0]}</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-sm text-gray-400">Humor Style</div>
              <div className="text-xs">{result.traits[1]}</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-sm text-gray-400">Community</div>
              <div className="text-xs">{result.traits[2]}</div>
            </div>
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-gray-400">Energy</div>
              <div className="text-xs">{result.traits[3]}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { Card } from '@/components/ui/card';
import { MemeOption } from './types';

interface MemeCardProps {
  meme: MemeOption;
  onSelect: () => void;
  isSelected?: boolean;
}

export const MemeCard = ({ meme, onSelect, isSelected }: MemeCardProps) => {
  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${isSelected ? 'ring-4 ring-pink-500 bg-pink-900/20' : 'hover:bg-gray-800/50'}
        p-6 text-center bg-black/50 backdrop-blur-sm border-2 border-gray-600/50 hover:border-purple-500/50
        max-w-sm mx-auto h-full flex flex-col
      `}
      onClick={onSelect}
    >
      <div className="aspect-square mb-6 rounded-xl overflow-hidden border-2 border-gray-600 hover:border-purple-500/70 transition-colors">
        <img 
          src={meme.image}
          alt={meme.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-white mb-4 leading-tight">{meme.title}</h3>
        
        <div className="space-y-3">
          {meme.category && (
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
              {meme.category}
            </span>
          )}
          
          {meme.tags && meme.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {meme.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-600/30">
        <div className="text-sm text-gray-400 font-medium">
          Tap to choose
        </div>
      </div>
    </Card>
  );
};

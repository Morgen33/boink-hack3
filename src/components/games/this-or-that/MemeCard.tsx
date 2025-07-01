
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
        cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${isSelected ? 'ring-4 ring-pink-500 bg-pink-900/20' : 'hover:bg-gray-800/50'}
        p-4 text-center
      `}
      onClick={onSelect}
    >
      <div className="aspect-square mb-4 rounded-lg overflow-hidden border-2 border-gray-600">
        <img 
          src={meme.image}
          alt={meme.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{meme.title}</h3>
      
      {meme.category && (
        <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded-full mb-2">
          {meme.category}
        </span>
      )}
      
      {meme.tags && (
        <div className="flex flex-wrap gap-1 justify-center">
          {meme.tags.map((tag, index) => (
            <span key={index} className="text-xs text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};

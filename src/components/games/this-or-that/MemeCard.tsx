
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
      
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-white leading-tight">{meme.title}</h3>
      </div>
    </Card>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Filter, Clock, MapPin, Target } from 'lucide-react';

interface DiscoveryFilters {
  maxDistance?: number;
  newThisWeek: boolean;
  ageRange?: { min: number; max: number };
  minCompatibilityScore?: number;
}

interface DiscoveryFiltersProps {
  filters: DiscoveryFilters;
  onFiltersChange: (filters: Partial<DiscoveryFilters>) => void;
  totalProfiles: number;
  userLocation?: string | null;
}

const DiscoveryFilters = ({ 
  filters, 
  onFiltersChange, 
  totalProfiles,
  userLocation 
}: DiscoveryFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>([
    filters.ageRange?.min || 18,
    filters.ageRange?.max || 65
  ]);

  const handleAgeRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setAgeRange(newRange);
    onFiltersChange({
      ageRange: { min: newRange[0], max: newRange[1] }
    });
  };

  const handleCompatibilityScoreChange = (values: number[]) => {
    onFiltersChange({
      minCompatibilityScore: values[0] / 100
    });
  };

  const clearAgeFilter = () => {
    setAgeRange([18, 65]);
    onFiltersChange({ ageRange: undefined });
  };

  const clearCompatibilityFilter = () => {
    onFiltersChange({ minCompatibilityScore: 0.5 });
  };

  const activeFiltersCount = [
    filters.newThisWeek,
    filters.ageRange,
    filters.minCompatibilityScore && filters.minCompatibilityScore > 0.5
  ].filter(Boolean).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalProfiles} matches
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Discovery Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* New This Week Filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="new-this-week" className="text-sm">
                  New This Week
                </Label>
              </div>
              <Switch
                id="new-this-week"
                checked={filters.newThisWeek}
                onCheckedChange={(checked) => 
                  onFiltersChange({ newThisWeek: checked })
                }
              />
            </div>

            {/* Age Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm">Age Range</Label>
                </div>
                {filters.ageRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAgeFilter}
                    className="text-xs h-6 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="px-2">
                <Slider
                  value={ageRange}
                  onValueChange={handleAgeRangeChange}
                  min={18}
                  max={65}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>18</span>
                  <span className="font-medium">
                    {ageRange[0]} - {ageRange[1]} years
                  </span>
                  <span>65</span>
                </div>
              </div>
            </div>

            {/* Compatibility Score Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-web3-red to-web3-magenta" />
                  <Label className="text-sm">Min Compatibility</Label>
                </div>
                {filters.minCompatibilityScore && filters.minCompatibilityScore > 0.5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompatibilityFilter}
                    className="text-xs h-6 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="px-2">
                <Slider
                  value={[(filters.minCompatibilityScore || 0.5) * 100]}
                  onValueChange={handleCompatibilityScoreChange}
                  min={50}
                  max={95}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>50%</span>
                  <span className="font-medium">
                    {Math.round((filters.minCompatibilityScore || 0.5) * 100)}%+ match
                  </span>
                  <span>95%</span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            {userLocation && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Matching from: {userLocation}</span>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DiscoveryFilters;
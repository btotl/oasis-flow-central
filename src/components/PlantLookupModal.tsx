
import { useState } from 'react';
import { Search, Loader, X, Leaf, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PlantResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  cycle?: string;
  watering?: string;
  sunlight?: string[];
  default_image?: {
    original_url: string;
    medium_url: string;
  };
}

interface PlantLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlant?: (plant: PlantResult) => void;
}

export const PlantLookupModal = ({ isOpen, onClose, onSelectPlant }: PlantLookupModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PlantResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<PlantResult | null>(null);

  const searchPlants = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // Using a demo response since we don't have the API key configured
      // In a real implementation, this would call the Perenual API
      const demoResults: PlantResult[] = [
        {
          id: 1,
          common_name: "Snake Plant",
          scientific_name: ["Sansevieria trifasciata"],
          cycle: "Perennial",
          watering: "Minimum",
          sunlight: ["Low", "Part shade"],
          default_image: {
            original_url: "https://images.unsplash.com/photo-1631377819268-b3d2d2e14fd3?w=400",
            medium_url: "https://images.unsplash.com/photo-1631377819268-b3d2d2e14fd3?w=200"
          }
        },
        {
          id: 2,
          common_name: "Peace Lily",
          scientific_name: ["Spathiphyllum wallisii"],
          cycle: "Perennial",
          watering: "Average",
          sunlight: ["Part shade", "Full shade"],
          default_image: {
            original_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            medium_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200"
          }
        }
      ];

      // Filter demo results based on search query
      const filteredResults = demoResults.filter(plant => 
        plant.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientific_name.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      setResults(filteredResults);
    } catch (err) {
      setError('Failed to search plants. Please check your API key configuration.');
      console.error('Plant search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlant = (plant: PlantResult) => {
    setSelectedPlant(plant);
    if (onSelectPlant) {
      onSelectPlant(plant);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="text-green-600" />
            Plant Lookup
          </h2>
          <Button onClick={onClose} className="neo-button bg-red-500 text-white">
            <X size={20} />
          </Button>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by common or scientific name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlants()}
              />
            </div>
            <Button 
              onClick={searchPlants}
              disabled={loading || !searchQuery.trim()}
              className="neo-button bg-neo-green text-white"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <Search size={20} />}
            </Button>
          </div>
          
          {!searchQuery && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Plant API integration requires configuration. 
                Currently showing demo results. Contact your administrator to set up the Perenual API key.
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results Section */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <Loader className="animate-spin mx-auto mb-4" size={40} />
              <p>Searching for plants...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((plant) => (
                <div 
                  key={plant.id} 
                  className="bg-white border-4 border-black p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelectPlant(plant)}
                >
                  {plant.default_image && (
                    <img 
                      src={plant.default_image.medium_url} 
                      alt={plant.common_name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <h3 className="font-bold text-lg mb-2">{plant.common_name}</h3>
                  
                  {plant.scientific_name && (
                    <p className="text-sm italic text-gray-600 mb-2">
                      {plant.scientific_name.join(', ')}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-sm">
                    {plant.cycle && (
                      <div className="flex items-center gap-2">
                        <Info size={14} className="text-blue-600" />
                        <span><strong>Cycle:</strong> {plant.cycle}</span>
                      </div>
                    )}
                    
                    {plant.watering && (
                      <div className="flex items-center gap-2">
                        <Info size={14} className="text-blue-600" />
                        <span><strong>Watering:</strong> {plant.watering}</span>
                      </div>
                    )}
                    
                    {plant.sunlight && (
                      <div className="flex items-center gap-2">
                        <Info size={14} className="text-blue-600" />
                        <span><strong>Light:</strong> {plant.sunlight.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="neo-button bg-neo-green text-white w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlant(plant);
                    }}
                  >
                    Select Plant
                  </Button>
                </div>
              ))}
            </div>
          ) : searchQuery && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <Leaf size={48} className="mx-auto mb-4 opacity-50" />
              <p>No plants found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>Search for plants by common or scientific name</p>
              <p className="text-sm mt-2">Enter a plant name above and click search</p>
            </div>
          )}
        </div>

        {/* Selected Plant Display */}
        {selectedPlant && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 rounded">
            <h4 className="font-bold text-green-800">Selected: {selectedPlant.common_name}</h4>
            <p className="text-sm text-green-700">
              Plant information has been selected and can be used in forms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

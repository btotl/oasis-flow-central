
import { useState, useEffect } from 'react';
import { X, Search, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface PlantResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image?: {
    medium_url: string;
    original_url: string;
  };
}

interface PlantSearchResponse {
  data: PlantResult[];
}

interface PlantLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlantLookupModal = ({ isOpen, onClose }: PlantLookupModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadApiKey();
    }
  }, [isOpen]);

  const loadApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'plant_api_key')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setApiKey(data?.setting_value || '');
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const searchPlants = async () => {
    if (!searchTerm.trim()) return;
    if (!apiKey.trim()) {
      setError('Plant API key not configured. Please go to Settings to add your Perenual API key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(searchTerm)}&page=1`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data: PlantSearchResponse = await response.json();
      setResults(data.data || []);
    } catch (err) {
      console.error('Plant search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search plants');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlants();
    }
  };

  const insertPlantInfo = (plant: PlantResult) => {
    const infoText = `${plant.common_name} (${plant.scientific_name?.[0] || ''})
Watering: ${plant.watering}
Sunlight: ${plant.sunlight?.join(', ') || ''}
Cycle: ${plant.cycle}`;
    
    navigator.clipboard.writeText(infoText).then(() => {
      alert('Plant info copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-4xl w-full rounded-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Plant Lookup</h2>
          <button
            onClick={onClose}
            className="neo-button text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {!apiKey && (
          <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
            <p className="text-yellow-800">
              Plant API key not configured. Please go to Settings to add your Perenual API key.
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by common or scientific name..."
            className="flex-1"
          />
          <Button 
            onClick={searchPlants} 
            disabled={loading || !searchTerm.trim() || !apiKey}
            className="neo-button bg-neo-green text-white"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto neo-scrollbar">
          {results.map((plant) => (
            <div key={plant.id} className="bg-white border-2 border-black p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{plant.common_name}</h4>
                  <p className="text-gray-600 italic">{plant.scientific_name?.[0]}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">Watering:</span> {plant.watering}</p>
                    <p><span className="font-medium">Sunlight:</span> {plant.sunlight?.join(', ')}</p>
                    <p><span className="font-medium">Cycle:</span> {plant.cycle}</p>
                  </div>
                </div>
                
                {plant.default_image && (
                  <img 
                    src={plant.default_image.medium_url} 
                    alt={plant.common_name}
                    className="w-20 h-20 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => {
                    setSelectedPlant(plant);
                    setShowDetails(true);
                  }}
                  className="neo-button bg-neo-blue text-white text-sm"
                >
                  <Info size={14} className="mr-1" />
                  Details
                </Button>
                <Button
                  onClick={() => insertPlantInfo(plant)}
                  className="neo-button bg-neo-yellow text-black text-sm"
                >
                  Copy Info
                </Button>
              </div>
            </div>
          ))}
          
          {results.length === 0 && !loading && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              No plants found for "{searchTerm}"
            </div>
          )}
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Plant Details</DialogTitle>
            </DialogHeader>
            {selectedPlant && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  {selectedPlant.default_image && (
                    <img 
                      src={selectedPlant.default_image.original_url} 
                      alt={selectedPlant.common_name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedPlant.common_name}</h3>
                    <p className="text-gray-600 italic text-lg">{selectedPlant.scientific_name?.[0]}</p>
                    {selectedPlant.other_name && selectedPlant.other_name.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Also known as: {selectedPlant.other_name.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800">Watering</h4>
                    <p className="text-blue-600">{selectedPlant.watering}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Sunlight</h4>
                    <p className="text-yellow-600">{selectedPlant.sunlight?.join(', ')}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800">Cycle</h4>
                    <p className="text-green-600">{selectedPlant.cycle}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => insertPlantInfo(selectedPlant)}
                  className="neo-button bg-neo-green text-white w-full"
                >
                  Copy Plant Information
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

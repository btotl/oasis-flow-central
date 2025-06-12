
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plantApiKey, setPlantApiKey] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAbn, setBusinessAbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setPlantApiKey(settings.plant_api_key || '');
      setBusinessName(settings.business_name || 'Plant Nursery');
      setBusinessAddress(settings.business_address || '');
      setBusinessPhone(settings.business_phone || '');
      setBusinessEmail(settings.business_email || '');
      setBusinessAbn(settings.business_abn || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const settingsToSave = [
        { key: 'plant_api_key', value: plantApiKey },
        { key: 'business_name', value: businessName },
        { key: 'business_address', value: businessAddress },
        { key: 'business_phone', value: businessPhone },
        { key: 'business_email', value: businessEmail },
        { key: 'business_abn', value: businessAbn },
      ];

      for (const setting of settingsToSave) {
        await supabase
          .from('app_settings')
          .upsert(
            {
              setting_key: setting.key,
              setting_value: setting.value,
            },
            {
              onConflict: 'setting_key'
            }
          );
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="neo-card p-4 sm:p-6 mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-green/20">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="neo-button bg-gray-500 text-white"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Settings */}
          <div className="neo-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Key size={20} />
              API Settings
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plant-api-key">Plant Lookup API Key (Perenual)</Label>
                <Input
                  id="plant-api-key"
                  type="password"
                  value={plantApiKey}
                  onChange={(e) => setPlantApiKey(e.target.value)}
                  placeholder="Enter your Perenual API key"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Get your free API key at{' '}
                  <a href="https://perenual.com/docs/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    perenual.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="neo-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your nursery name"
                />
              </div>
              <div>
                <Label htmlFor="business-address">Address</Label>
                <Input
                  id="business-address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Business address"
                />
              </div>
              <div>
                <Label htmlFor="business-phone">Phone</Label>
                <Input
                  id="business-phone"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="Business phone"
                />
              </div>
              <div>
                <Label htmlFor="business-email">Email</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="Business email"
                />
              </div>
              <div>
                <Label htmlFor="business-abn">ABN</Label>
                <Input
                  id="business-abn"
                  value={businessAbn}
                  onChange={(e) => setBusinessAbn(e.target.value)}
                  placeholder="Australian Business Number"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={saveSettings}
            disabled={loading}
            className={`neo-button-primary px-8 ${saveSuccess ? 'bg-green-500' : ''}`}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

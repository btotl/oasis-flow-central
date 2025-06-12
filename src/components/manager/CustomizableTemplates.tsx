
import { useState, useEffect } from 'react';
import { Save, Eye, Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateSettings {
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_abn: string;
  logo_url: string;
  receipt_footer: string;
  receipt_header: string;
}

export const CustomizableTemplates = () => {
  const [settings, setSettings] = useState<TemplateSettings>({
    business_name: 'Plant Nursery',
    business_address: '123 Garden Street, Green Valley',
    business_phone: '(555) 123-4567',
    business_email: 'info@plantnursery.com',
    business_abn: 'ABN 12 345 678 901',
    logo_url: '',
    receipt_footer: 'Thank you for your business!',
    receipt_header: 'Welcome to our Plant Nursery'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplateSettings();
  }, []);

  const fetchTemplateSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .in('setting_key', [
          'business_name', 'business_address', 'business_phone', 
          'business_email', 'business_abn', 'logo_url',
          'receipt_footer', 'receipt_header'
        ]);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching template settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(update, { onConflict: 'setting_key' });
        
        if (error) throw error;
      }

      console.log('Template settings saved successfully');
    } catch (error) {
      console.error('Error saving template settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof TemplateSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const ReceiptPreview = () => (
    <div className="bg-white border-4 border-black p-6 rounded-xl max-w-sm mx-auto font-mono text-sm">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        {settings.logo_url && (
          <img src={settings.logo_url} alt="Logo" className="w-20 h-20 mx-auto mb-2 object-contain" />
        )}
        <h3 className="font-bold text-lg">{settings.business_name}</h3>
        <p className="text-xs">{settings.business_address}</p>
        <p className="text-xs">{settings.business_phone}</p>
        <p className="text-xs">{settings.business_email}</p>
        <p className="text-xs">{settings.business_abn}</p>
        {settings.receipt_header && (
          <p className="text-xs mt-2 font-bold">{settings.receipt_header}</p>
        )}
      </div>
      
      <div className="border-b border-gray-300 pb-2 mb-2">
        <div className="flex justify-between">
          <span>Sample Plant</span>
          <span>$25.00</span>
        </div>
        <div className="flex justify-between">
          <span>Garden Tool</span>
          <span>$15.00</span>
        </div>
      </div>
      
      <div className="border-b-2 border-black pb-2 mb-4">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>$40.00</span>
        </div>
      </div>
      
      <div className="text-center text-xs">
        <p>{new Date().toLocaleString()}</p>
        {settings.receipt_footer && (
          <p className="mt-2">{settings.receipt_footer}</p>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="text-center py-4">Loading template settings...</div>;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-yellow/20 to-neo-green/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Receipt & Label Templates</h3>
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="neo-button bg-neo-green text-white"
        >
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Business Information</h4>
              
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={settings.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="business-address">Address</Label>
                <Textarea
                  id="business-address"
                  value={settings.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="business-phone">Phone</Label>
                <Input
                  id="business-phone"
                  value={settings.business_phone}
                  onChange={(e) => handleInputChange('business_phone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="business-email">Email</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={settings.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="business-abn">ABN/Tax ID</Label>
                <Input
                  id="business-abn"
                  value={settings.business_abn}
                  onChange={(e) => handleInputChange('business_abn', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg">Receipt Customization</h4>
              
              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input
                  id="logo-url"
                  value={settings.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload your logo to a public URL and paste the link here
                </p>
              </div>

              <div>
                <Label htmlFor="receipt-header">Receipt Header Message</Label>
                <Input
                  id="receipt-header"
                  value={settings.receipt_header}
                  onChange={(e) => handleInputChange('receipt_header', e.target.value)}
                  placeholder="Welcome message or promotion"
                />
              </div>

              <div>
                <Label htmlFor="receipt-footer">Receipt Footer Message</Label>
                <Textarea
                  id="receipt-footer"
                  value={settings.receipt_footer}
                  onChange={(e) => handleInputChange('receipt_footer', e.target.value)}
                  placeholder="Thank you message, return policy, etc."
                  rows={3}
                />
              </div>

              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                <h5 className="font-bold text-blue-800">Template Usage</h5>
                <p className="text-sm text-blue-700 mt-1">
                  These settings will be automatically applied to all receipts printed 
                  from the Receipt Maker and any exported labels.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">Receipt Preview</h4>
            <p className="text-sm text-gray-600 mb-6">
              This shows how your receipts will look with the current settings
            </p>
            <ReceiptPreview />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

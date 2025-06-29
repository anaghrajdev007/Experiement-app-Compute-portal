import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, HelpCircle, Trash2, Shield, Eye, Volume2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PermissionState {
  bluetooth: boolean;
  camera: boolean;
  location: boolean;
}

const Settings: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [permissions, setPermissions] = useState<PermissionState>({
    bluetooth: true,
    camera: false,
    location: false
  });
  const [language, setLanguage] = useState('english');
  const [accessibilityMode, setAccessibilityMode] = useState('standard');
  const [textSize, setTextSize] = useState([16]);
  const [showPermissionModal, setShowPermissionModal] = useState<string | null>(null);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handlePermissionToggle = (permission: keyof PermissionState) => {
    const currentValue = permissions[permission];
    
    if (!currentValue) {
      // Request permission
      setShowPermissionModal(permission);
    } else {
      // Disable permission
      setPermissions(prev => ({ ...prev, [permission]: false }));
      setHasUnsavedChanges(true);
    }
  };

  const grantPermission = () => {
    if (showPermissionModal) {
      setPermissions(prev => ({ ...prev, [showPermissionModal]: true }));
      setHasUnsavedChanges(true);
    }
    setShowPermissionModal(null);
  };

  const denyPermission = () => {
    setShowPermissionModal(null);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setHasUnsavedChanges(true);
  };

  const handleAccessibilityChange = (value: string) => {
    setAccessibilityMode(value);
    setHasUnsavedChanges(true);
  };

  const handleTextSizeChange = (value: number[]) => {
    setTextSize(value);
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Simulate saving settings
    setHasUnsavedChanges(false);
    // Apply text size globally (in real app, this would update CSS variables)
    document.documentElement.style.fontSize = `${textSize[0]}px`;
  };

  const clearCache = () => {
    // Simulate cache clearing
    setShowClearCacheModal(false);
    // In real app, this would clear stored device data
  };

  const getPermissionDescription = (permission: string) => {
    switch (permission) {
      case 'bluetooth':
        return 'Required to discover and connect to edge devices';
      case 'camera':
        return 'Needed to scan QR codes for device setup';
      case 'location':
        return 'Used to optimize device connectivity and performance';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('welcome')}
          className="text-slate-400 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('support')}
          className="text-slate-400 hover:text-white"
          aria-label="Help and Support"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Permissions Section */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base capitalize">
                    {key === 'bluetooth' ? 'Bluetooth' : key === 'camera' ? 'Camera' : 'Location'}
                  </Label>
                  <p className="text-sm text-slate-400">
                    {getPermissionDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={() => handlePermissionToggle(key as keyof PermissionState)}
                  aria-label={`Toggle ${key} permission`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="german">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-slate-700" />

            {/* Accessibility Mode */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Accessibility Mode
              </Label>
              <Select value={accessibilityMode} onValueChange={handleAccessibilityChange}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select accessibility mode" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                  <SelectItem value="large-text">Large Text</SelectItem>
                  <SelectItem value="voice-over">VoiceOver Enhanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-slate-700" />

            {/* Text Size */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Text Size
              </Label>
              <div className="space-y-2">
                <Slider
                  value={textSize}
                  onValueChange={handleTextSizeChange}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  aria-label="Adjust text size"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Small (12px)</span>
                  <span className="font-medium" style={{ fontSize: `${textSize[0]}px` }}>
                    Preview ({textSize[0]}px)
                  </span>
                  <span>Large (24px)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Device Cache</Label>
                  <p className="text-sm text-slate-400">
                    Clear stored device data and connection history
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearCacheModal(true)}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                  aria-label="Clear device cache"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          disabled={!hasUnsavedChanges}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          aria-label="Save settings"
        >
          Save Changes
        </Button>
      </div>

      {/* Permission Request Modal */}
      <Dialog open={!!showPermissionModal} onOpenChange={() => setShowPermissionModal(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Permission Required
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            This app needs {showPermissionModal} access to function properly. 
            {showPermissionModal && getPermissionDescription(showPermissionModal)}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={denyPermission}
            >
              Deny
            </Button>
            <Button
              onClick={grantPermission}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Grant Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Cache Confirmation Modal */}
      <Dialog open={showClearCacheModal} onOpenChange={setShowClearCacheModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              Clear Device Cache
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            This will remove all cached device data and connection history. You may need to re-pair your devices. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearCacheModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={clearCache}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Cache
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import WelcomeScreen from './WelcomeScreen';
import DeviceDiscovery from './DeviceDiscovery';
import QRScanner from './QRScanner';
import ManualEntry from './ManualEntry';
import BluetoothPairing from './BluetoothPairing';
import WiFiConfiguration from './WiFiConfiguration';
import BottomNavigation from './BottomNavigation';
import Updates from '@/pages/Updates';
import Support from '@/pages/Support';
import Settings from '@/pages/Settings';
import Devices from '@/pages/Devices';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings as SettingsIcon, History, CheckCircle, Smartphone } from 'lucide-react';

const SetupProgress = () => {
  const { setupProgress, setupStage, setCurrentScreen } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Setup Progress</h1>
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-400">Setup Complete!</h2>
              <p className="text-slate-300 mt-2">Your edge device has been successfully configured</p>
            </div>
            <Progress value={100} className="mb-4" />
            <div className="text-center">
              <Button onClick={() => setCurrentScreen('welcome')} className="bg-blue-600 hover:bg-blue-700">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SetupHistory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Setup History</h1>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No setup history available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DeviceManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Device Management</h1>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Smartphone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No devices configured yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const { currentScreen } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen />;
      case 'discovery': return <DeviceDiscovery />;
      case 'qr-scanner': return <QRScanner />;
      case 'manual-entry': return <ManualEntry />;
      case 'bluetooth-pairing': return <BluetoothPairing />;
      case 'wifi-config': return <WiFiConfiguration />;
      case 'setup-progress': return <SetupProgress />;
      case 'setup-history': return <SetupHistory />;
      case 'device-management': return <DeviceManagement />;
      case 'firmware-update': return <Updates />;
      case 'support': return <Support />;
      case 'settings': return <Settings />;
      case 'updates': return <Updates />;
      case 'devices': return <Devices />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
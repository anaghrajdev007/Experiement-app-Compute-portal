import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wifi, Lock, Eye, EyeOff, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';

interface WiFiNetwork {
  ssid: string;
  signalStrength: number;
  security: 'Open' | 'WEP' | 'WPA2' | 'WPA3';
  connected: boolean;
}

const WiFiConfiguration: React.FC = () => {
  const { setCurrentScreen, setWifiCredentials } = useAppContext();
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHiddenNetwork, setIsHiddenNetwork] = useState(false);
  const [manualSSID, setManualSSID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mockNetworks: WiFiNetwork[] = [
    { ssid: 'HomeNetwork_5G', signalStrength: 85, security: 'WPA3', connected: false },
    { ssid: 'OfficeWiFi', signalStrength: 72, security: 'WPA2', connected: false },
    { ssid: 'CafeGuest', signalStrength: 45, security: 'Open', connected: false },
    { ssid: 'Neighbor_2.4G', signalStrength: 38, security: 'WPA2', connected: false },
  ];

  const scanNetworks = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNetworks(mockNetworks);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    scanNetworks();
  }, []);

  const getSignalBars = (strength: number) => {
    if (strength > 75) return 4;
    if (strength > 50) return 3;
    if (strength > 25) return 2;
    return 1;
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'WPA3': return 'bg-green-500';
      case 'WPA2': return 'bg-blue-500';
      case 'WEP': return 'bg-orange-500';
      case 'Open': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleConnect = async () => {
    const networkToConnect = isHiddenNetwork 
      ? { ssid: manualSSID, signalStrength: 0, security: 'WPA2' as const, connected: false }
      : selectedNetwork;
    
    if (!networkToConnect) return;
    
    setIsConnecting(true);
    
    setTimeout(() => {
      const success = Math.random() > 0.15;
      
      if (success) {
        setWifiCredentials({ ssid: networkToConnect.ssid, password });
        setIsConnecting(false);
        setShowSuccessDialog(true);
      } else {
        setIsConnecting(false);
        setErrorMessage('Failed to connect. Please check your password.');
        setShowErrorDialog(true);
      }
    }, 3000);
  };

  const filteredNetworks = networks.filter(network => 
    network.ssid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Configure WiFi</h1>
            <p className="text-slate-400">Connect your device to a network</p>
          </div>
          <Button onClick={scanNetworks} disabled={isScanning} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search networks..." className="pl-10 bg-slate-800 border-slate-600 text-white" />
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Checkbox id="hidden-network" checked={isHiddenNetwork} onCheckedChange={setIsHiddenNetwork} />
          <Label htmlFor="hidden-network" className="text-slate-300">Connect to hidden network</Label>
        </div>

        {isHiddenNetwork && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-4">
              <Label className="text-slate-200 mb-2 block">Network Name (SSID)</Label>
              <Input value={manualSSID} onChange={(e) => setManualSSID(e.target.value)} placeholder="Enter network name" className="bg-slate-700 border-slate-600 text-white" />
            </CardContent>
          </Card>
        )}

        {!isHiddenNetwork && (
          <div className="space-y-3 mb-6">
            {filteredNetworks.map((network) => (
              <Card key={network.ssid} className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-colors ${selectedNetwork?.ssid === network.ssid ? 'border-blue-500 bg-blue-500/10' : 'hover:bg-slate-800/70'}`} onClick={() => setSelectedNetwork(network)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: getSignalBars(network.signalStrength) }, (_, i) => (
                          <div key={i} className="w-1 h-3 bg-blue-400 rounded-full" />
                        ))}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{network.ssid}</h3>
                          {network.security !== 'Open' && <Lock className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <Badge className={`${getSecurityColor(network.security)} text-white text-xs mt-1`}>{network.security}</Badge>
                      </div>
                    </div>
                    {selectedNetwork?.ssid === network.ssid && <CheckCircle className="w-5 h-5 text-blue-400" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(selectedNetwork || isHiddenNetwork) && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-white">{isHiddenNetwork ? manualSSID || 'Hidden Network' : selectedNetwork?.ssid}</h3>
              
              {((selectedNetwork && selectedNetwork.security !== 'Open') || isHiddenNetwork) && (
                <div className="space-y-2">
                  <Label className="text-slate-200">Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter network password" className="bg-slate-700 border-slate-600 text-white pr-10" />
                    <Button type="button" onClick={() => setShowPassword(!showPassword)} variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
              
              <Button onClick={handleConnect} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />WiFi Connected
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300">Successfully connected to the network!</p>
            <Button onClick={() => { setShowSuccessDialog(false); setCurrentScreen('setup-progress'); }} className="w-full bg-blue-600 hover:bg-blue-700">Continue Setup</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />Connection Failed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300">{errorMessage}</p>
            <Button onClick={() => setShowErrorDialog(false)} className="w-full bg-blue-600 hover:bg-blue-700">Try Again</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WiFiConfiguration;
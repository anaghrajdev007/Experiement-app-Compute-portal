import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bluetooth, Signal, MapPin, RefreshCw, QrCode, Filter, AlertTriangle, Eye, Volume2, ArrowLeft } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  model: string;
  rssi: number;
  distance: string;
  status: 'Setup Ready' | 'In Use' | 'Error';
}

const DeviceDiscovery: React.FC = () => {
  const { setCurrentScreen, setCurrentDevice } = useAppContext();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [sortBy, setSortBy] = useState('signal');
  const [filterBy, setFilterBy] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockDevices: Device[] = [
    { id: '1', name: 'ComputePortal-A1B2', model: 'Edge-Pro', rssi: -45, distance: '~2m', status: 'Setup Ready' },
    { id: '2', name: 'ComputePortal-C3D4', model: 'Edge-Lite', rssi: -62, distance: '~5m', status: 'In Use' },
    { id: '3', name: 'ComputePortal-E5F6', model: 'Edge-Pro', rssi: -38, distance: '~1m', status: 'Setup Ready' },
    { id: '4', name: 'ComputePortal-G7H8', model: 'Edge-Max', rssi: -78, distance: '~8m', status: 'Error' },
  ];

  const startScanning = () => {
    setIsScanning(true);
    setDevices([]);
    setError(null);
    
    // Simulate progressive device discovery
    setTimeout(() => {
      setDevices([mockDevices[0]]);
    }, 1000);
    
    setTimeout(() => {
      setDevices([mockDevices[0], mockDevices[1]]);
    }, 2000);
    
    setTimeout(() => {
      // Simulate occasional error
      if (Math.random() > 0.7) {
        setError('Bluetooth scan timeout. Please ensure Bluetooth is enabled.');
      }
      setDevices(mockDevices);
      setIsScanning(false);
    }, 3500);
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    startScanning();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    startScanning();
  }, []);

  const getSignalBars = (rssi: number) => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Setup Ready': return 'bg-green-500';
      case 'In Use': return 'bg-yellow-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeviceSelect = (device: Device) => {
    setCurrentDevice(device);
    setCurrentScreen('qr-scanner');
  };

  const filteredDevices = devices.filter(device => {
    if (filterBy === 'all') return true;
    return device.status === filterBy;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortBy === 'signal') return b.rssi - a.rssi;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('welcome')}
              className="text-slate-400 hover:text-white p-2"
              aria-label="Go back to welcome screen"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1" role="heading" aria-level={1}>Discover Edge Nodes</h1>
              <p className="text-slate-400">Find nearby devices via Bluetooth</p>
            </div>
          </div>
          <Button
            onClick={startScanning}
            disabled={isScanning}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            aria-label="Refresh device scan"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning' : 'Refresh'}
          </Button>
        </div>

        {/* Accessibility Indicators */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Screen Reader Ready</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Voice Guidance</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <Alert className="mb-6 bg-red-900/50 border-red-700 text-red-100">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={() => setError(null)}
                className="ml-2 text-red-200 hover:text-white p-0 h-auto"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Pull-to-Refresh Indicator */}
        {isRefreshing && (
          <div className="text-center mb-4">
            <RefreshCw className="w-6 h-6 text-blue-400 mx-auto animate-spin" />
            <p className="text-sm text-slate-400 mt-1">Refreshing...</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600" aria-label="Sort devices by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="signal">Signal</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-36 bg-slate-800 border-slate-600" aria-label="Filter devices by status">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Setup Ready">Setup Ready</SelectItem>
              <SelectItem value="In Use">In Use</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Device List */}
        <div 
          className="space-y-4"
          onTouchStart={(e) => {
            const startY = e.touches[0].clientY;
            const handleTouchMove = (moveEvent: TouchEvent) => {
              const currentY = moveEvent.touches[0].clientY;
              if (currentY - startY > 100 && window.scrollY === 0) {
                handlePullToRefresh();
                document.removeEventListener('touchmove', handleTouchMove);
              }
            };
            document.addEventListener('touchmove', handleTouchMove);
            setTimeout(() => document.removeEventListener('touchmove', handleTouchMove), 300);
          }}
        >
          {isScanning && devices.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Bluetooth className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-slate-400">Scanning for devices...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {sortedDevices.map((device) => (
            <Card key={device.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      <Badge className={`${getStatusColor(device.status)} text-white text-xs`}>
                        {device.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1" aria-label={`Signal strength: ${device.rssi} dBm`}>
                        <Signal className="w-4 h-4" />
                        {Array.from({ length: getSignalBars(device.rssi) }, (_, i) => (
                          <div key={i} className="w-1 h-3 bg-blue-400 rounded-full" />
                        ))}
                        <span className="ml-1">{device.rssi} dBm</span>
                      </span>
                      
                      <span className="flex items-center gap-1" aria-label={`Distance: ${device.distance}`}>
                        <MapPin className="w-4 h-4" />
                        {device.distance}
                      </span>
                      
                      <span>{device.model}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDeviceSelect(device)}
                    disabled={device.status !== 'Setup Ready'}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
                    aria-label={`Scan QR code for ${device.name}`}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isScanning && sortedDevices.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Bluetooth className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400 mb-2">No devices found</p>
                  <p className="text-sm text-slate-500">Make sure Bluetooth is enabled and devices are nearby</p>
                  <Button
                    onClick={startScanning}
                    variant="outline"
                    size="sm"
                    className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDiscovery;
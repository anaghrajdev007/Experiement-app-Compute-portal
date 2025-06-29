import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw, X, Settings } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import DeviceCard from '@/components/DeviceCard';
import DeviceDetailPanel from '@/components/DeviceDetailPanel';

// Dummy data for devices
const dummyDevices = [
  {
    id: '1',
    name: 'Edge Node Alpha',
    status: 'online' as const,
    lastUpdated: '2 minutes ago',
    cpuUsage: 45,
    memoryUsage: 67,
    networkStatus: 'Connected - 150 Mbps'
  },
  {
    id: '2', 
    name: 'Edge Node Beta',
    status: 'offline' as const,
    lastUpdated: '1 hour ago',
    cpuUsage: 0,
    memoryUsage: 0,
    networkStatus: 'Disconnected'
  },
  {
    id: '3',
    name: 'Edge Node Gamma',
    status: 'online' as const,
    lastUpdated: '5 minutes ago', 
    cpuUsage: 78,
    memoryUsage: 34,
    networkStatus: 'Connected - 89 Mbps'
  }
];

const DevicesPage: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [devices, setDevices] = useState(dummyDevices);
  const [selectedDevice, setSelectedDevice] = useState<typeof dummyDevices[0] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setDevices([...dummyDevices]);
      setNotification('Device list updated');
      setIsRefreshing(false);
      setTimeout(() => setNotification(null), 3000);
    }, 1000);
  };

  const handleViewDetails = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    setSelectedDevice(device || null);
  };

  const handleConfigure = (deviceId: string) => {
    setNotification('Redirecting to configuration...');
    setTimeout(() => {
      setCurrentScreen('wifi-config');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('welcome')}
              className="text-gray-400 hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Devices</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white"
              aria-label="Refresh devices"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('settings')}
              className="text-gray-400 hover:text-white"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <Alert className="mb-4 bg-blue-900 border-blue-700">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-100">{notification}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotification(null)}
                className="text-blue-300 hover:text-blue-100 h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Device Detail Panel */}
        {selectedDevice && (
          <DeviceDetailPanel
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
          />
        )}

        {/* Device List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Registered Devices</h2>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onViewDetails={handleViewDetails}
              onConfigure={handleConfigure}
            />
          ))}
        </div>

        {devices.length === 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No devices registered yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
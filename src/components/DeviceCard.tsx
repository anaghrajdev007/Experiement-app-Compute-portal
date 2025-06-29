import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Settings, Activity } from 'lucide-react';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    status: 'online' | 'offline';
    lastUpdated: string;
    cpuUsage: number;
    memoryUsage: number;
    networkStatus: string;
  };
  onViewDetails: (deviceId: string) => void;
  onConfigure: (deviceId: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onViewDetails, onConfigure }) => {
  return (
    <Card className="mb-4 bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{device.name}</CardTitle>
          <div className="flex items-center gap-2">
            {device.status === 'online' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <Badge 
              variant={device.status === 'online' ? 'default' : 'destructive'}
              className={device.status === 'online' ? 'bg-green-600' : 'bg-red-600'}
            >
              {device.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">
            Last updated: {device.lastUpdated}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(device.id)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Activity className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(device.id)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
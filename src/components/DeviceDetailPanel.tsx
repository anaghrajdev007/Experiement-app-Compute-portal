import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Cpu, HardDrive, Wifi } from 'lucide-react';

interface DeviceDetailPanelProps {
  device: {
    id: string;
    name: string;
    status: 'online' | 'offline';
    cpuUsage: number;
    memoryUsage: number;
    networkStatus: string;
    lastUpdated: string;
  } | null;
  onClose: () => void;
}

const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = ({ device, onClose }) => {
  if (!device) return null;

  return (
    <Card className="mb-4 bg-gray-800 border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">
            {device.name} - Details
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">CPU Usage</span>
            </div>
            <Progress value={device.cpuUsage} className="h-2" />
            <span className="text-xs text-gray-400">{device.cpuUsage}%</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-green-400" />
              <span className="text-gray-300 text-sm">Memory Usage</span>
            </div>
            <Progress value={device.memoryUsage} className="h-2" />
            <span className="text-xs text-gray-400">{device.memoryUsage}%</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Network Status</span>
            </div>
            <span className="text-xs text-gray-400">{device.networkStatus}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Last updated: {device.lastUpdated}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceDetailPanel;
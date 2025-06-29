import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MoreVertical, Edit, Trash2, Eye, Volume2, Wifi, Power, Settings } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  model: string;
  status: 'Online' | 'Offline' | 'Error';
  lastSeen: string;
  ipAddress: string;
  firmwareVersion: string;
}

const DeviceManagement: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [devices] = useState<Device[]>([
    { id: '1', name: 'ComputePortal-A1B2', model: 'Edge-Pro', status: 'Online', lastSeen: '2 min ago', ipAddress: '192.168.1.101', firmwareVersion: '2.1.4' },
    { id: '2', name: 'ComputePortal-C3D4', model: 'Edge-Lite', status: 'Offline', lastSeen: '1 hour ago', ipAddress: '192.168.1.102', firmwareVersion: '2.0.8' },
    { id: '3', name: 'ComputePortal-E5F6', model: 'Edge-Max', status: 'Error', lastSeen: '5 min ago', ipAddress: '192.168.1.103', firmwareVersion: '2.1.2' }
  ]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-green-500';
      case 'Offline': return 'bg-gray-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewDetails = (device: Device) => {
    setSelectedDevice(device);
    setShowDetailDialog(true);
  };

  const handleRename = (device: Device) => {
    setSelectedDevice(device);
    setNewName(device.name);
    setShowRenameDialog(true);
  };

  const handleRemove = (device: Device) => {
    // In real app, this would remove the device
    console.log('Removing device:', device.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
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
            <h1 className="text-2xl font-bold" role="heading" aria-level={1}>Device Management</h1>
            <p className="text-slate-400">Manage your connected edge devices</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Device Status</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Voice Navigation</span>
          </div>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <Card key={device.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      <Badge className={`${getStatusColor(device.status)} text-white text-xs`}>
                        {device.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>
                        <span className="block">Model: {device.model}</span>
                        <span className="block">IP: {device.ipAddress}</span>
                      </div>
                      <div>
                        <span className="block">Firmware: {device.firmwareVersion}</span>
                        <span className="block">Last seen: {device.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(device)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                      aria-label={`View details for ${device.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleRename(device)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                      aria-label={`Rename ${device.name}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleRemove(device)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                      aria-label={`Remove ${device.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          
          {selectedDevice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Device Name</Label>
                  <p className="font-semibold">{selectedDevice.name}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Model</Label>
                  <p>{selectedDevice.model}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Status</Label>
                  <Badge className={`${getStatusColor(selectedDevice.status)} text-white text-xs w-fit`}>
                    {selectedDevice.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-slate-400">IP Address</Label>
                  <p className="font-mono">{selectedDevice.ipAddress}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Firmware</Label>
                  <p>{selectedDevice.firmwareVersion}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Last Seen</Label>
                  <p>{selectedDevice.lastSeen}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setCurrentScreen('firmware-update')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button
                  onClick={() => setShowDetailDialog(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Rename Device</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="newName" className="text-slate-200">New Device Name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter new name"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  console.log('Renaming to:', newName);
                  setShowRenameDialog(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowRenameDialog(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceManagement;
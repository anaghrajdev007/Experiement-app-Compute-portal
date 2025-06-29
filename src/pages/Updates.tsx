import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Settings, RefreshCw, Download, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Device {
  id: string;
  name: string;
  currentVersion: string;
  availableVersion?: string;
  hasUpdate: boolean;
  updateStatus: 'idle' | 'updating' | 'success' | 'error';
  updateProgress: number;
}

const Updates: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Edge Node 001', currentVersion: '1.2.3', availableVersion: '1.3.0', hasUpdate: true, updateStatus: 'idle', updateProgress: 0 },
    { id: '2', name: 'Edge Node 002', currentVersion: '1.3.0', hasUpdate: false, updateStatus: 'idle', updateProgress: 0 },
    { id: '3', name: 'Edge Node 003', currentVersion: '1.1.5', availableVersion: '1.3.0', hasUpdate: true, updateStatus: 'idle', updateProgress: 0 }
  ]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setNotification({ type: 'success', message: 'Update check completed' });
    setIsChecking(false);
  };

  const installUpdate = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || !device.hasUpdate) return;

    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, updateStatus: 'updating', updateProgress: 0 } : d
    ));

    // Simulate update progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, updateProgress: i } : d
      ));
    }

    // Simulate success or failure
    const success = Math.random() > 0.3;
    if (success) {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { 
          ...d, 
          updateStatus: 'success', 
          currentVersion: d.availableVersion!, 
          availableVersion: undefined,
          hasUpdate: false,
          updateProgress: 100
        } : d
      ));
      setShowSuccessModal(true);
    } else {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, updateStatus: 'error', updateProgress: 0 } : d
      ));
      setShowErrorModal(true);
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
        <h1 className="text-xl font-semibold">Updates</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('settings')}
          className="text-slate-400 hover:text-white"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <Alert className="m-4 border-blue-500 bg-blue-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {notification.message}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotification(null)}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="p-4 space-y-4">
        {/* Check for Updates Button */}
        <Button
          onClick={checkForUpdates}
          disabled={isChecking}
          className="w-full bg-blue-600 hover:bg-blue-700"
          aria-label="Check for updates"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking...' : 'Check for Updates'}
        </Button>

        {/* Device List */}
        <div className="space-y-3">
          {devices.map((device) => (
            <Card key={device.id} className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <p className="text-sm text-slate-400">Version {device.currentVersion}</p>
                  </div>
                  {device.hasUpdate && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                      Update Available
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              {device.hasUpdate && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-6 py-2 text-blue-400 hover:text-blue-300"
                      onClick={() => setSelectedDevice(device)}
                    >
                      View Update Details
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3 p-4 bg-slate-800 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span>{device.currentVersion}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available:</span>
                          <span className="text-green-400">{device.availableVersion}</span>
                        </div>
                        <div className="text-sm text-slate-300">
                          <p className="font-medium mb-1">Release Notes:</p>
                          <p>• Performance improvements</p>
                          <p>• Bug fixes and security updates</p>
                          <p>• New features and enhancements</p>
                        </div>
                        
                        {device.updateStatus === 'updating' && (
                          <div className="space-y-2">
                            <Progress value={device.updateProgress} className="w-full" />
                            <p className="text-sm text-center">{device.updateProgress}% complete</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          {device.updateStatus === 'idle' && (
                            <Button
                              onClick={() => installUpdate(device.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              aria-label={`Install update for ${device.name}`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Install Update
                            </Button>
                          )}
                          {device.updateStatus === 'updating' && (
                            <Button
                              variant="outline"
                              className="flex-1"
                              aria-label="Cancel update"
                            >
                              Cancel
                            </Button>
                          )}
                          {device.updateStatus === 'error' && (
                            <Button
                              onClick={() => installUpdate(device.id)}
                              variant="outline"
                              className="flex-1"
                              aria-label="Retry update"
                            >
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Update Failed
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">Update failed due to network issues. Please check your connection and try again.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowErrorModal(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowErrorModal(false);
                if (selectedDevice) installUpdate(selectedDevice.id);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              Update Successful
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">The device has been successfully updated to the latest version.</p>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Finish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Updates;
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, CheckCircle, AlertTriangle, Eye, Volume2, RefreshCw } from 'lucide-react';

const FirmwareUpdate: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [currentVersion] = useState('2.1.4');
  const [availableVersion] = useState('2.2.0');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [updateStage, setUpdateStage] = useState('');

  const updateStages = [
    'Downloading firmware...',
    'Verifying integrity...',
    'Installing update...',
    'Restarting device...',
    'Finalizing installation...'
  ];

  const handleInstallUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    // Simulate update process
    let progress = 0;
    let stageIndex = 0;
    
    const updateInterval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(updateInterval);
        setIsUpdating(false);
        
        // Simulate success/failure
        if (Math.random() > 0.2) {
          setShowSuccessDialog(true);
        } else {
          setShowErrorDialog(true);
        }
      } else {
        // Update stage based on progress
        const newStageIndex = Math.floor((progress / 100) * updateStages.length);
        if (newStageIndex !== stageIndex && newStageIndex < updateStages.length) {
          stageIndex = newStageIndex;
          setUpdateStage(updateStages[stageIndex]);
        }
      }
      
      setUpdateProgress(Math.min(progress, 100));
    }, 500);
  };

  const handleRetry = () => {
    setShowErrorDialog(false);
    handleInstallUpdate();
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    setCurrentScreen('device-management');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen('device-management')}
            className="text-slate-400 hover:text-white p-2"
            aria-label="Go back to device management"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" role="heading" aria-level={1}>Firmware Update</h1>
            <p className="text-slate-400">Keep your device up to date</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Update Progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Status Updates</span>
          </div>
        </div>

        {/* Current Status */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Current Version</p>
                <p className="font-semibold text-lg">{currentVersion}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Available Version</p>
                <p className="font-semibold text-lg text-green-400">{availableVersion}</p>
              </div>
            </div>
            
            {isUpdating && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-slate-300">{updateStage}</p>
                  <p className="text-slate-400 text-sm">{Math.round(updateProgress)}%</p>
                </div>
                <Progress 
                  value={updateProgress} 
                  className="h-3"
                  aria-label={`Update progress: ${Math.round(updateProgress)}%`}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Information */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">What's New in v{availableVersion}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Improved WiFi connectivity stability</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Enhanced security protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Performance optimizations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Bug fixes and stability improvements</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Warning */}
        <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/30">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Do not disconnect or power off the device during the update process.
          </AlertDescription>
        </Alert>

        {/* Install Button */}
        <Button
          onClick={handleInstallUpdate}
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 py-6 text-lg"
          aria-label="Install firmware update"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Installing Update...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install Update
            </div>
          )}
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              Update Successful
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-300">
              Firmware has been successfully updated to version {availableVersion}.
            </p>
            
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Update Summary:</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Firmware version: {availableVersion}</li>
                <li>• Installation time: 3 minutes 42 seconds</li>
                <li>• Device restart: Completed</li>
                <li>• All systems: Operational</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleFinish} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              aria-label="Finish and return to device management"
            >
              Finish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Update Failed
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-300">
              The firmware update failed to complete. The device is still functional with the previous version.
            </p>
            
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Possible causes:</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Network connectivity issues</li>
                <li>• Insufficient storage space</li>
                <li>• Power interruption</li>
                <li>• Corrupted update file</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                aria-label="Retry firmware update"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Update
              </Button>
              <Button 
                onClick={() => setShowErrorDialog(false)} 
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

export default FirmwareUpdate;
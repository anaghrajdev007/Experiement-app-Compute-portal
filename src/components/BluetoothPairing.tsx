import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bluetooth, CheckCircle, XCircle, RefreshCw, Wifi } from 'lucide-react';

type PairingStage = 'connecting' | 'authenticating' | 'establishing' | 'success' | 'error';

const BluetoothPairing: React.FC = () => {
  const { currentDevice, setCurrentScreen } = useAppContext();
  const [pairingStage, setPairingStage] = useState<PairingStage>('connecting');
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const stageMessages = {
    connecting: 'Establishing Bluetooth connection...',
    authenticating: 'Authenticating with setup key...',
    establishing: 'Establishing secure channel...',
    success: 'Pairing completed successfully!',
    error: 'Pairing failed'
  };

  const startPairing = () => {
    setPairingStage('connecting');
    setProgress(0);
    setErrorMessage('');
    
    // Simulate pairing process
    const stages = [
      { stage: 'connecting' as PairingStage, duration: 2000, progress: 25 },
      { stage: 'authenticating' as PairingStage, duration: 1500, progress: 60 },
      { stage: 'establishing' as PairingStage, duration: 1000, progress: 90 }
    ];
    
    let currentStageIndex = 0;
    
    const processNextStage = () => {
      if (currentStageIndex >= stages.length) {
        // Simulate success/failure
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          setPairingStage('success');
          setProgress(100);
          setTimeout(() => setShowSuccessDialog(true), 500);
        } else {
          setPairingStage('error');
          setErrorMessage(getRandomError());
          setShowErrorDialog(true);
        }
        return;
      }
      
      const currentStage = stages[currentStageIndex];
      setPairingStage(currentStage.stage);
      
      // Animate progress
      const startProgress = currentStageIndex === 0 ? 0 : stages[currentStageIndex - 1].progress;
      const targetProgress = currentStage.progress;
      const duration = currentStage.duration;
      const steps = 20;
      const stepDuration = duration / steps;
      const progressStep = (targetProgress - startProgress) / steps;
      
      let step = 0;
      const progressInterval = setInterval(() => {
        step++;
        setProgress(startProgress + (progressStep * step));
        
        if (step >= steps) {
          clearInterval(progressInterval);
          currentStageIndex++;
          setTimeout(processNextStage, 200);
        }
      }, stepDuration);
    };
    
    processNextStage();
  };

  const getRandomError = () => {
    const errors = [
      'Connection timeout - device not responding',
      'Authentication failed - invalid setup key',
      'Device already paired with another app',
      'Bluetooth interference detected',
      'Device firmware incompatible'
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  };

  useEffect(() => {
    startPairing();
  }, []);

  const handleRetry = () => {
    setShowErrorDialog(false);
    setRetryCount(prev => prev + 1);
    
    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
    setTimeout(() => {
      startPairing();
    }, delay);
  };

  const handleCancel = () => {
    setCurrentScreen('qr-scanner');
  };

  const handleContinue = () => {
    setShowSuccessDialog(false);
    setCurrentScreen('wifi-config');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Pair with Device</h1>
          <p className="text-slate-400">Establishing secure connection</p>
          {currentDevice && (
            <p className="text-sm text-blue-400 mt-2">Device: {currentDevice.name}</p>
          )}
        </div>

        {/* Pairing Status Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Bluetooth className={`w-10 h-10 text-blue-400 ${
                    pairingStage !== 'success' && pairingStage !== 'error' ? 'animate-pulse' : ''
                  }`} />
                </div>
                
                {/* Status indicator */}
                {pairingStage === 'success' && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                
                {pairingStage === 'error' && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">
                {stageMessages[pairingStage]}
              </h3>
              
              {pairingStage !== 'success' && pairingStage !== 'error' && (
                <p className="text-slate-400 text-sm">Please wait while we connect to your device</p>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-blue-400">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-slate-700"
              />
            </div>
            
            {/* Stage Indicators */}
            <div className="flex justify-between text-xs text-slate-400 mb-6">
              <span className={pairingStage === 'connecting' ? 'text-blue-400' : progress > 25 ? 'text-green-400' : ''}>
                Connect
              </span>
              <span className={pairingStage === 'authenticating' ? 'text-blue-400' : progress > 60 ? 'text-green-400' : ''}>
                Authenticate
              </span>
              <span className={pairingStage === 'establishing' ? 'text-blue-400' : progress > 90 ? 'text-green-400' : ''}>
                Secure
              </span>
            </div>
            
            {/* Retry count */}
            {retryCount > 0 && (
              <p className="text-center text-yellow-400 text-sm mb-4">
                Retry attempt {retryCount}
              </p>
            )}
            
            {/* Cancel Button */}
            {pairingStage !== 'success' && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancel Pairing
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Connection Info */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm">
              <Bluetooth className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-slate-300">Bluetooth LE Connection</p>
                <p className="text-slate-500">Encrypted communication channel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              Pairing Successful
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-300">
              Your device has been successfully paired and is ready for WiFi configuration.
            </p>
            
            <div className="bg-slate-700/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Device:</span>
                <span>{currentDevice?.name || 'ComputePortal-A1B2'}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security:</span>
                <span className="text-blue-400">Encrypted</span>
              </div>
            </div>
            
            <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700">
              <Wifi className="w-4 h-4 mr-2" />
              Continue to WiFi Setup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              Pairing Failed
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-300">{errorMessage}</p>
            
            <div className="bg-slate-700/50 rounded-lg p-3 text-sm">
              <p className="text-slate-400 mb-2">Troubleshooting tips:</p>
              <ul className="text-slate-300 space-y-1 text-xs">
                <li>• Ensure device is within 10 meters</li>
                <li>• Check that Bluetooth is enabled</li>
                <li>• Verify the setup key is correct</li>
                <li>• Make sure device is not paired elsewhere</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Pairing
              </Button>
              
              <Button 
                onClick={handleCancel} 
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

export default BluetoothPairing;
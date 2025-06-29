import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Flashlight, RotateCcw, Edit, CheckCircle, XCircle, ArrowLeft, Eye, Volume2, SwitchCamera } from 'lucide-react';

const QRScanner: React.FC = () => {
  const { currentDevice, setCurrentScreen } = useAppContext();
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        const success = Math.random() > 0.3;
        
        if (success) {
          const mockData = {
            deviceId: currentDevice?.name || 'ComputePortal-A1B2',
            model: currentDevice?.model || 'Edge-Pro',
            serialNumber: 'CP' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            setupKey: Math.random().toString(36).substr(2, 16).toUpperCase(),
            firmwareVersion: '2.1.4'
          };
          setScannedData(mockData);
          setShowSuccessDialog(true);
          setIsScanning(false);
        } else {
          setScanAttempts(prev => prev + 1);
          setShowErrorDialog(true);
          setIsScanning(false);
        }
      }, 2000 + Math.random() * 2000);

      return () => clearTimeout(timer);
    }
  }, [isScanning, currentDevice]);

  const handleRetry = () => {
    setShowErrorDialog(false);
    setIsScanning(true);
  };

  const handleManualEntry = () => {
    setShowErrorDialog(false);
    setCurrentScreen('manual-entry');
  };

  const handleContinue = () => {
    setShowSuccessDialog(false);
    setCurrentScreen('bluetooth-pairing');
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'front' ? 'back' : 'front');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen('discovery')}
            className="text-slate-400 hover:text-white p-2"
            aria-label="Go back to device discovery"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold mb-1" role="heading" aria-level={1}>Scan QR Code</h1>
            {currentDevice && (
              <p className="text-sm text-blue-400">Device: {currentDevice.name}</p>
            )}
          </div>
          <div className="w-10" />
        </div>

        <div className="text-center mb-6">
          <p className="text-slate-300 mb-2">Align the QR code within the frame below</p>
          <p className="text-sm text-slate-400">Ensure good lighting and hold the device steady</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Camera Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Audio Feedback</span>
          </div>
        </div>

        <div className="relative mb-8">
          <Card className="bg-black border-slate-700 overflow-hidden">
            <CardContent className="p-0 aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">Camera View ({cameraFacing})</p>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 border-2 border-blue-400 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-blue-400 rounded-br-lg" />
                    
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden rounded-lg">
                        <div className="w-full h-0.5 bg-blue-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-center text-sm text-slate-400 mt-4">Position QR code here</p>
                </div>
              </div>
              
              {flashEnabled && (
                <div className="absolute inset-0 bg-white opacity-10" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={toggleFlash}
            variant="outline"
            size="lg"
            className={`border-slate-600 ${flashEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-300'}`}
            aria-label={`${flashEnabled ? 'Disable' : 'Enable'} camera flash`}
          >
            <Flashlight className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={switchCamera}
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300"
            aria-label="Switch camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          {isScanning ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <p className="text-slate-400">Scanning for QR code...</p>
            </div>
          ) : (
            <p className="text-slate-400">Scan complete</p>
          )}
          
          {scanAttempts > 0 && (
            <p className="text-yellow-400 text-sm mt-2">Attempt {scanAttempts}/3</p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleManualEntry}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            aria-label="Switch to manual device entry"
          >
            <Edit className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              QR Code Scanned Successfully
            </DialogTitle>
          </DialogHeader>
          
          {scannedData && (
            <div className="space-y-3">
              <p className="text-slate-300 mb-4">Device information retrieved:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Device ID</p>
                  <p className="font-mono">{scannedData.deviceId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Model</p>
                  <p>{scannedData.model}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleContinue} 
                className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
              >
                Continue to Pairing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              Scan Failed
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-300">
              {scanAttempts >= 3 
                ? "Unable to scan QR code. Try manual entry or check lighting."
                : "QR code not detected. Ensure good lighting and steady positioning."
              }
            </p>
            
            <div className="flex gap-3">
              {scanAttempts < 3 && (
                <Button onClick={handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              )}
              
              <Button 
                onClick={handleManualEntry} 
                variant="outline" 
                className="flex-1 border-slate-600 text-slate-300"
              >
                Manual Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRScanner;
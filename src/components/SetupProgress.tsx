import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SetupStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface SetupProgressProps {
  wifiConfig: any;
  onComplete: () => void;
  onCancel: () => void;
}

const SetupProgress: React.FC<SetupProgressProps> = ({ wifiConfig, onComplete, onCancel }) => {
  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 'discovery', name: 'Device Discovery', status: 'completed' },
    { id: 'pairing', name: 'Bluetooth Pairing', status: 'completed' },
    { id: 'configuration', name: 'WiFi Configuration', status: 'active' },
    { id: 'network', name: 'Network Connection', status: 'pending' },
    { id: 'registration', name: 'Device Registration', status: 'pending' },
    { id: 'complete', name: 'Setup Complete', status: 'pending' }
  ]);
  
  const [progress, setProgress] = useState(40);
  const [currentMessage, setCurrentMessage] = useState('Configuring WiFi settings...');
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    simulateSetupProcess();
  }, []);

  const simulateSetupProcess = async () => {
    const stepSequence = [
      { step: 'configuration', progress: 60, message: 'Transferring WiFi credentials...', delay: 2000 },
      { step: 'network', progress: 75, message: 'Connecting to WiFi network...', delay: 3000 },
      { step: 'registration', progress: 90, message: 'Registering device with cloud service...', delay: 2500 },
      { step: 'complete', progress: 100, message: 'Setup completed successfully!', delay: 1500 }
    ];

    for (const { step, progress: newProgress, message, delay } of stepSequence) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Simulate occasional errors (10% chance)
      if (Math.random() < 0.1 && step !== 'complete') {
        setSteps(prev => prev.map(s => 
          s.id === step ? { ...s, status: 'error' } : s
        ));
        setError(`Failed during ${step} phase. Please check your network connection.`);
        return;
      }

      setSteps(prev => prev.map(s => {
        if (s.id === step) return { ...s, status: 'completed' };
        const stepIndex = prev.findIndex(step => step.id === s.id);
        const currentIndex = prev.findIndex(step => step.id === step);
        if (stepIndex === currentIndex + 1) return { ...s, status: 'active' };
        return s;
      }));
      
      setProgress(newProgress);
      setCurrentMessage(message);
      
      if (step === 'complete') {
        setIsComplete(true);
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Setup Progress</h1>
          <p className="text-gray-600 mt-2">Configuring your edge device</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl mb-4">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-3" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{currentMessage}</p>
              {!isComplete && !error && (
                <p className="text-xs text-gray-500 mt-1">
                  Estimated time remaining: {formatTime(timeRemaining)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl mb-4">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Setup Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.status === 'completed' ? 'text-green-600' :
                      step.status === 'active' ? 'text-blue-600' :
                      step.status === 'error' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-6 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="bg-red-50 border-red-200 mb-4">
            <XCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isComplete && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Device setup completed successfully! Your edge device is now connected to {wifiConfig.ssid}.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {isComplete ? (
            <Button 
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Finish Setup
            </Button>
          ) : (
            <Button 
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg"
            >
              Cancel Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupProgress;
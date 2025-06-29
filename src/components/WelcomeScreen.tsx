import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Wifi, Bluetooth, QrCode, Settings, History, ChevronLeft, Eye, Volume2 } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const onboardingSteps = [
    {
      icon: <Bluetooth className="w-8 h-8 text-blue-400" />,
      title: "Discover Devices",
      description: "Find nearby edge compute nodes via Bluetooth",
      detail: "Your device will automatically scan for available edge nodes in the area."
    },
    {
      icon: <QrCode className="w-8 h-8 text-blue-400" />,
      title: "Scan QR Code",
      description: "Scan the device QR code for identification",
      detail: "Use your camera to scan the QR code on your edge device for secure pairing."
    },
    {
      icon: <Wifi className="w-8 h-8 text-blue-400" />,
      title: "Configure WiFi",
      description: "Connect your device to available networks",
      detail: "Select and configure WiFi networks for your edge device connectivity."
    },
    {
      icon: <Settings className="w-8 h-8 text-blue-400" />,
      title: "Monitor Progress",
      description: "Track setup progress in real-time",
      detail: "Watch as your device is configured and connected to your network."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % onboardingSteps.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + onboardingSteps.length) % onboardingSteps.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" role="heading" aria-level={1}>ComputePortal Setup</h1>
          <p className="text-slate-400 text-lg">Set up your edge compute node in minutes</p>
        </div>

        {/* Accessibility Indicators */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Screen Reader Ready</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Voice Guidance</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-slate-700 min-h-[200px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSlide}
                  className="text-slate-400 hover:text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center flex-1">
                  <div className="mb-4">{onboardingSteps[currentSlide].icon}</div>
                  <h3 className="font-semibold text-white mb-2 text-xl">{onboardingSteps[currentSlide].title}</h3>
                  <p className="text-slate-400 mb-2">{onboardingSteps[currentSlide].description}</p>
                  <p className="text-slate-300 text-sm">{onboardingSteps[currentSlide].detail}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSlide}
                  className="text-slate-400 hover:text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Slide Indicators */}
              <div className="flex justify-center gap-2">
                {onboardingSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => setCurrentScreen('discovery')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            size="lg"
            aria-label="Start device setup process"
          >
            Start Setup
          </Button>
          
          <Button 
            onClick={() => setCurrentScreen('setup-history')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 py-4"
            aria-label="View previous setup attempts"
          >
            <History className="w-4 h-4 mr-2" />
            View Setup History
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setCurrentScreen('settings')}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              aria-label="Open app settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={() => setCurrentScreen('support')}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              aria-label="Get help and support"
            >
              Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
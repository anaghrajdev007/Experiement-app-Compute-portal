import React from 'react';
import { useAppContext, Screen } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Home, Search, QrCode, Wifi, History, Settings, Smartphone, HardDrive, HelpCircle } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useAppContext();

  const navItems = [
    { id: 'welcome' as Screen, label: 'Home', icon: Home },
    { id: 'discovery' as Screen, label: 'Discover', icon: Search },
    { id: 'devices' as Screen, label: 'Devices', icon: Smartphone },
    { id: 'updates' as Screen, label: 'Updates', icon: HardDrive },
    { id: 'support' as Screen, label: 'Support', icon: HelpCircle },
    { id: 'settings' as Screen, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 h-auto min-w-0 ${
                isActive 
                  ? 'text-blue-400 bg-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
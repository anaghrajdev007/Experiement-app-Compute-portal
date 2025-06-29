import React, { createContext, useContext, useState } from 'react';

export type Screen = 'welcome' | 'discovery' | 'qr-scanner' | 'manual-entry' | 'bluetooth-pairing' | 'wifi-config' | 'setup-progress' | 'setup-history' | 'settings' | 'device-management' | 'firmware-update' | 'support' | 'updates' | 'devices';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentDevice: any;
  setCurrentDevice: (device: any) => void;
  setupProgress: number;
  setSetupProgress: (progress: number) => void;
  setupStage: string;
  setSetupStage: (stage: string) => void;
  wifiCredentials: { ssid: string; password: string } | null;
  setWifiCredentials: (credentials: { ssid: string; password: string } | null) => void;
  setupHistory: any[];
  setSetupHistory: (history: any[]) => void;
}

const defaultAppContext: AppContextType = {
  currentScreen: 'welcome',
  setCurrentScreen: () => {},
  currentDevice: null,
  setCurrentDevice: () => {},
  setupProgress: 0,
  setSetupProgress: () => {},
  setupStage: 'Discovery',
  setSetupStage: () => {},
  wifiCredentials: null,
  setWifiCredentials: () => {},
  setupHistory: [],
  setSetupHistory: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentDevice, setCurrentDevice] = useState(null);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState('Discovery');
  const [wifiCredentials, setWifiCredentials] = useState<{ ssid: string; password: string } | null>(null);
  const [setupHistory, setSetupHistory] = useState<any[]>([]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentDevice,
        setCurrentDevice,
        setupProgress,
        setSetupProgress,
        setupStage,
        setSetupStage,
        wifiCredentials,
        setWifiCredentials,
        setupHistory,
        setSetupHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
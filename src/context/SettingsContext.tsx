import { createContext, useContext, ReactNode, FC, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Settings } from '../types';
import { INITIAL_TESTIMONIALS } from '../constants';

const defaultSettings: Settings = {
    gtm: {
        head: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MGFZBPVK');`,
        body: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGFZBPVK"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    },
    contact: {
        address: "SHA KUNDANMAL MISRIMAL,\n#52, Narayana Mudali Street,\nSowcarpet, Chennai – 600 079",
        phone1: "+91-9840647096",
        phone2: "9841137052",
        email: "tapeindiain@yahoo.com"
    },
    socialLinks: {
        facebook: "https://www.facebook.com/tapeindia",
        linkedin: "https://www.linkedin.com/company/tape-india",
        instagram: "https://www.instagram.com/tapeindia"
    },
    popularProductIds: [
        'ptfe-silicone-adhesive',
        'coloured-anti-slip-tape',
        'silver-tc',
    ],
    testimonials: INITIAL_TESTIMONIALS
};


interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('tapeindia_settings_v1', defaultSettings);

  useEffect(() => {
    // Data validation: If settings object is corrupted, reset to defaults.
    const isValid = settings &&
                    typeof settings === 'object' &&
                    settings.contact &&
                    settings.popularProductIds &&
                    Array.isArray(settings.popularProductIds);
    
    if (!isValid) {
        setSettings(defaultSettings);
    }
  }, [settings, setSettings]);

  // Ensure consumers always receive a valid settings object.
  const validSettings = (settings && typeof settings === 'object' && settings.contact) ? settings : defaultSettings;

  const value = { settings: validSettings, setSettings };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
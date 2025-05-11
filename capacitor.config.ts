
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3aa6ae4bc665426cb0889b374d8fb80d',
  appName: 'fiscalizacao-urbana-app',
  webDir: 'dist',
  server: {
    url: "https://3aa6ae4b-c665-426c-b088-9b374d8fb80d.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  }
};

export default config;

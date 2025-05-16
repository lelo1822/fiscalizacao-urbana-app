
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3aa6ae4bc665426cb0889b374d8fb80d',
  appName: 'fiscalizacao-urbana-app',
  webDir: 'dist',
  server: {
    url: "https://3aa6ae4bc665426cb0889b374d8fb80d.lovable.app?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    },
    Geolocation: {
      permissions: [
        "location",
        "location-always",
        "location-when-in-use"
      ]
    },
    Camera: {
      permissions: [
        "camera",
        "photos"
      ]
    }
  }
};

export default config;

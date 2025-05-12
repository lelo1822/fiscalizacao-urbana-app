
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the default Leaflet icon
export const createDefaultIcon = () => {
  return L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
};

// Set default icon for Leaflet markers
export const initializeLeafletIcons = () => {
  L.Marker.prototype.options.icon = createDefaultIcon();
};

// Create custom marker icons based on status/priority
export const createCustomMarkerIcon = (markerColor: string, markerSize: number) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${markerColor}; width: ${markerSize}px; height: ${markerSize}px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize/2, markerSize/2]
  });
};

// Create pin marker icon (like the red pin in the image)
export const createPinMarkerIcon = (color: string = '#ea384c', size: number = 30) => {
  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="position:relative;">
        <svg width="${size}" height="${size * 1.5}" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C29.86 0 13.5 16.36 13.5 36.5C13.5 65.06 50 100 50 100s36.5-34.94 36.5-63.5C86.5 16.36 70.14 0 50 0z" 
                fill="${color}" stroke="white" stroke-width="5"/>
          <circle cx="50" cy="36.5" r="13.5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [size, size * 1.5],
    iconAnchor: [size/2, size * 1.5]
  });
};

// Create user location icon
export const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

// Get marker color based on status and priority
export const getMarkerColor = (status?: string, priority?: string) => {
  if (status === 'resolved') return '#10b981';
  if (status === 'in_progress') return '#f59e0b';
  if (priority === 'high') return '#ef4444';
  if (priority === 'medium') return '#f59e0b';
  return '#3b82f6';
};

// Get marker size based on priority
export const getMarkerSize = (priority?: string) => {
  if (priority === 'high') return 14;
  if (priority === 'medium') return 12;
  return 10;
};

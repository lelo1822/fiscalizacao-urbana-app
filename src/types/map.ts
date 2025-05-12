
export interface MapMarker {
  id: string | number;
  position: [number, number];
  title?: string;
  status?: 'pending' | 'in_progress' | 'resolved';
  type?: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
  iconUrl?: string;
  iconType?: 'default' | 'circle' | 'pin';
}

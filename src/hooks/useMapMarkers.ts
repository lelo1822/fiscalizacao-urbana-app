
import { useMemo } from 'react';
import type { MapMarker } from '@/types/map';
import type { Report } from '@/types/dashboard';
import { convertReportsToMarkers } from '@/services/reports';

/**
 * Hook to convert reports to map markers
 */
export const useMapMarkers = (reports: Report[] = []) => {
  // Convert reports to markers using the utility function
  const markers = useMemo(() => {
    // Ensure reports is an array
    const safeReports = Array.isArray(reports) ? reports : [];
    
    // Convert reports to map markers
    return convertReportsToMarkers(safeReports);
  }, [reports]);

  return { markers };
};

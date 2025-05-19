
import type { MapMarker } from "@/types/map";
import type { Report } from "@/types/dashboard";

export const convertReportsToMarkers = (reports: Report[]): MapMarker[] => {
  return reports.map(report => ({
    id: report.id.toString(),
    position: [report.coordinates?.lat || 0, report.coordinates?.lng || 0] as [number, number],
    title: report.address,
    status: report.status === "Pendente" ? "pending" : 
            report.status === "Em andamento" ? "in_progress" : "resolved",
    type: report.type,
    iconType: 'pin' // Using 'pin' type for all occurrences
  }));
};

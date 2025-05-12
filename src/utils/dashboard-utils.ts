
import { MapMarker, Report } from "@/types/dashboard";

// Convert Report objects to MapMarker format
export const reportToMapMarkers = (reports: Report[]): MapMarker[] => {
  return reports.map(report => ({
    id: report.id,
    position: report.position,
    title: report.address,
    type: report.type,
    status: report.status === "Pendente" ? "pending" : 
            report.status === "Em análise" ? "in_progress" : "resolved" as any,
    priority: report.priority as any
  }));
};

// Simulate loading with a promise
export const simulateLoading = (duration: number = 300): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};


import type { MapMarker } from "@/types/map";

// Mock data for reports (in a real app, this would come from an API)
export const mockReports = [
  {
    id: "1",
    type: "Buraco na via",
    address: "Rua das Flores, 123 - Centro",
    position: [-23.55052, -46.633308] as [number, number],
    status: "pending" as const,
    date: "2023-05-08T10:30:00"
  },
  {
    id: "2",
    type: "Árvore caída",
    address: "Av. Principal, 456 - Jardim",
    position: [-23.54550, -46.638100] as [number, number],
    status: "in_progress" as const,
    date: "2023-05-07T08:45:00"
  },
  {
    id: "3",
    type: "Lâmpada queimada",
    address: "Praça Central",
    position: [-23.56052, -46.629708] as [number, number],
    status: "resolved" as const,
    date: "2023-05-06T16:20:00"
  },
  {
    id: "4",
    type: "Lixo acumulado",
    address: "Rua Lateral, 789 - Vila Nova",
    position: [-23.55552, -46.641308] as [number, number],
    status: "pending" as const,
    date: "2023-05-05T11:15:00"
  },
  {
    id: "5",
    type: "Buraco na via",
    address: "Av. Secundária, 321 - Bairro Sul",
    position: [-23.54852, -46.623308] as [number, number],
    status: "in_progress" as const,
    date: "2023-05-04T09:30:00"
  },
];

export const getFilteredReports = (filter: string) => {
  let filteredReports = [...mockReports];
  
  if (filter !== "all") {
    if (["pending", "in_progress", "resolved"].includes(filter)) {
      filteredReports = mockReports.filter(report => report.status === filter);
    } else {
      // Filter by type of issue
      filteredReports = mockReports.filter(report => 
        report.type.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }
  
  return filteredReports;
};

export const convertReportsToMarkers = (reports: typeof mockReports): MapMarker[] => {
  return reports.map(report => ({
    id: report.id,
    position: report.position,
    title: report.address,
    status: report.status,
    type: report.type,
    iconType: 'pin' // Using 'pin' type for all occurrences
  }));
};

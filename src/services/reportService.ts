
import type { MapMarker } from "@/types/map";
import type { Report } from "@/types/dashboard";

// Mock data for reports (in a real app, this would come from an API)
const mockReports: Report[] = [
  {
    id: 1,
    type: "Buraco na via",
    description: "Buraco grande no meio da pista causando risco para veículos",
    address: "Rua das Flores, 123 - Centro",
    coordinates: { lat: -23.55052, lng: -46.633308 },
    status: "Pendente",
    createdAt: "2023-05-08T10:30:00",
    agent: {
      id: "1",
      name: "Agente Silva",
      gabineteId: "1"
    }
  },
  {
    id: 2,
    type: "Árvore caída",
    description: "Árvore caída bloqueando parcialmente a via",
    address: "Av. Principal, 456 - Jardim",
    coordinates: { lat: -23.54550, lng: -46.638100 },
    status: "Em andamento",
    createdAt: "2023-05-07T08:45:00",
    agent: {
      id: "2",
      name: "Agente Oliveira",
      gabineteId: "2"
    }
  },
  {
    id: 3,
    type: "Lâmpada queimada",
    description: "Lâmpada de poste queimada, deixando a área escura",
    address: "Praça Central",
    coordinates: { lat: -23.56052, lng: -46.629708 },
    status: "Resolvido",
    createdAt: "2023-05-06T16:20:00",
    agent: {
      id: "1",
      name: "Agente Silva",
      gabineteId: "1"
    }
  },
  {
    id: 4,
    type: "Lixo acumulado",
    description: "Lixo acumulado na calçada há vários dias",
    address: "Rua Lateral, 789 - Vila Nova",
    coordinates: { lat: -23.55552, lng: -46.641308 },
    status: "Pendente",
    createdAt: "2023-05-05T11:15:00",
    agent: {
      id: "3",
      name: "Agente Souza",
      gabineteId: "3"
    }
  },
  {
    id: 5,
    type: "Buraco na via",
    description: "Buraco de médio porte causando congestionamento",
    address: "Av. Secundária, 321 - Bairro Sul",
    coordinates: { lat: -23.54852, lng: -46.623308 },
    status: "Em andamento",
    createdAt: "2023-05-04T09:30:00",
    agent: {
      id: "2",
      name: "Agente Oliveira",
      gabineteId: "2"
    }
  },
];

export const getFilteredReports = (filter: string): Report[] => {
  let filteredReports = [...mockReports];
  
  if (filter !== "all") {
    if (["pending", "in_progress", "resolved"].includes(filter)) {
      filteredReports = mockReports.filter(report => {
        if (filter === "pending") return report.status === "Pendente";
        if (filter === "in_progress") return report.status === "Em andamento";
        if (filter === "resolved") return report.status === "Resolvido";
        return true;
      });
    } else {
      // Filter by type of issue
      filteredReports = mockReports.filter(report => 
        report.type.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }
  
  return filteredReports;
};

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

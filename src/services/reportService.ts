
import type { MapMarker } from "@/types/map";
import type { Report } from "@/types/dashboard";

// Array para armazenar os relatórios reais (em um aplicativo de produção, isto seria substituído por um banco de dados)
const reports: Report[] = [];

export const getFilteredReports = (filter: string): Report[] => {
  let filteredReports = [...reports];
  
  if (filter !== "all") {
    if (["pending", "in_progress", "resolved"].includes(filter)) {
      filteredReports = reports.filter(report => {
        if (filter === "pending") return report.status === "Pendente";
        if (filter === "in_progress") return report.status === "Em andamento";
        if (filter === "resolved") return report.status === "Resolvido";
        return true;
      });
    } else {
      // Filtrar por tipo de problema
      filteredReports = reports.filter(report => 
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
    iconType: 'pin' // Usando tipo 'pin' para todas as ocorrências
  }));
};

// Função para adicionar um novo relatório
export const addReport = (report: Omit<Report, "id">): Report => {
  const newReport = {
    ...report,
    id: reports.length + 1,
    createdAt: new Date().toISOString()
  };
  
  reports.push(newReport);
  return newReport;
};

// Função para obter um relatório por ID
export const getReportById = (id: number): Report | undefined => {
  return reports.find(report => report.id === id);
};

// Função para atualizar o status de um relatório
export const updateReportStatus = (id: number, status: string): boolean => {
  const report = reports.find(report => report.id === id);
  
  if (report) {
    report.status = status;
    return true;
  }
  
  return false;
};

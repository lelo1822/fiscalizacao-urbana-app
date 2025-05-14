
import { Report } from "@/types/dashboard";
import type { MapMarker } from "@/types/map";

export const countReportsByStatus = (reports: Report[]) => {
  return {
    total: reports.length,
    pending: reports.filter(report => report.status === "Pendente").length,
    inProgress: reports.filter(report => report.status === "Em andamento").length,
    resolved: reports.filter(report => report.status === "Resolvido").length
  };
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pendente":
      return "blue";
    case "Em andamento":
      return "orange";
    case "Resolvido":
      return "green";
    default:
      return "gray";
  }
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatDateWithTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Error formatting date with time:", error);
    return dateString;
  }
};

// Funções adicionadas para resolver os erros
export const reportToMapMarkers = (reports: Report[]): MapMarker[] => {
  return reports
    .filter(report => report.coordinates)
    .map(report => ({
      id: report.id,
      position: [
        report.coordinates?.lat || 0,
        report.coordinates?.lng || 0
      ],
      popupContent: `
        <div>
          <h3>${report.type}</h3>
          <p>${report.description}</p>
          <p>Status: ${report.status}</p>
        </div>
      `,
      type: report.status,
    }));
};

export const simulateLoading = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

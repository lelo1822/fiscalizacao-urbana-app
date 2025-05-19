
import type { Report } from "@/types/dashboard";
import { getReports } from "./store";

export const getFilteredReports = (filter: string): Report[] => {
  const reports = getReports();
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
      // Filter by type of problem
      filteredReports = reports.filter(report => 
        report.type.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }
  
  return filteredReports;
};

// Function to search reports with text
export const searchReports = (searchText: string): Report[] => {
  const reports = getReports();
  
  if (!searchText || searchText.trim() === '') {
    return reports;
  }
  
  const lowerSearchText = searchText.toLowerCase();
  
  return reports.filter(report => 
    report.type.toLowerCase().includes(lowerSearchText) ||
    report.description.toLowerCase().includes(lowerSearchText) ||
    report.address.toLowerCase().includes(lowerSearchText) ||
    (report.complainant?.fullName && report.complainant.fullName.toLowerCase().includes(lowerSearchText)) ||
    report.id.toString().includes(lowerSearchText)
  );
};

// Get unique report types
export const getUniqueReportTypes = (): string[] => {
  const reports = getReports();
  const types = new Set(reports.map(report => report.type));
  return Array.from(types);
};

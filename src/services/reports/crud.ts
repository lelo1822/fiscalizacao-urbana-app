
import type { Report } from "@/types/dashboard";
import { getReports, setReports } from "./store";

// Add a new report
export const addReport = (report: Omit<Report, "id">): Report => {
  const reports = getReports();
  const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
  
  const newReport = {
    ...report,
    id: newId,
    createdAt: new Date().toISOString()
  };
  
  const updatedReports = [...reports, newReport];
  setReports(updatedReports);
  return newReport;
};

// Get a report by ID
export const getReportById = (id: number): Report | undefined => {
  const reports = getReports();
  return reports.find(report => report.id === id);
};

// Update a report's status
export const updateReportStatus = (
  id: number, 
  status: string, 
  resolution?: { description: string, responsible: string }
): boolean => {
  const reports = getReports();
  const index = reports.findIndex(report => report.id === id);
  
  if (index !== -1) {
    const updatedReport = { ...reports[index] };
    updatedReport.status = status;
    updatedReport.updatedAt = new Date().toISOString();
    
    if (status === "Resolvido" && resolution) {
      updatedReport.resolution = {
        ...resolution,
        date: new Date().toISOString()
      };
    }
    
    const updatedReports = [...reports];
    updatedReports[index] = updatedReport;
    
    setReports(updatedReports);
    return true;
  }
  
  return false;
};

// Delete a report
export const deleteReport = (id: number): boolean => {
  const reports = getReports();
  const updatedReports = reports.filter(report => report.id !== id);
  
  if (updatedReports.length !== reports.length) {
    setReports(updatedReports);
    return true;
  }
  
  return false;
};


import type { Report } from "@/types/dashboard";
import { saveReportsToStorage } from "./storage";
import { initializeReports } from "./mock-data";

// Create a singleton instance of reports for the application
let reports: Report[] = initializeReports();

// Export the getter for the reports array
export const getReports = (): Report[] => {
  return reports;
};

// Export a setter that also saves to storage
export const setReports = (newReports: Report[]): void => {
  reports = newReports;
  saveReportsToStorage(reports);
};

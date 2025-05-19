
import { getReports } from "./store";

// Function to get dashboard statistics
export const getDashboardStats = () => {
  const reports = getReports();
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'Pendente').length;
  const inProgress = reports.filter(r => r.status === 'Em andamento').length;
  const resolved = reports.filter(r => r.status === 'Resolvido').length;
  
  return {
    totalReports: total,
    pendingReports: pending,
    inProgressReports: inProgress,
    resolvedReports: resolved
  };
};

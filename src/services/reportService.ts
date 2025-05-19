
// This file is now a re-export of the new modularized service
// It helps maintain backward compatibility while we transition to the new structure

export {
  getFilteredReports,
  searchReports,
  getUniqueReportTypes,
  addReport,
  getReportById,
  updateReportStatus,
  deleteReport,
  convertReportsToMarkers,
  getDashboardStats
} from './reports';

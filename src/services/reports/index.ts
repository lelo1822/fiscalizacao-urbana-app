
// Main entry point for report services
// Re-export all functions from other modules for convenient access

// Export filtering functions
export { 
  getFilteredReports, 
  searchReports, 
  getUniqueReportTypes 
} from './filters';

// Export CRUD operations
export { 
  addReport, 
  getReportById, 
  updateReportStatus, 
  deleteReport 
} from './crud';

// Export map utilities
export { convertReportsToMarkers } from './map-utils';

// Export statistics functions
export { getDashboardStats } from './stats';

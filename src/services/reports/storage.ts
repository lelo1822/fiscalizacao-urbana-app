
// This file handles all localStorage operations for reports

const REPORTS_STORAGE_KEY = 'camaraRua_reports';

export const loadReportsFromStorage = (): any[] => {
  try {
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (storedReports) {
      return JSON.parse(storedReports);
    }
  } catch (error) {
    console.error('Erro ao carregar relatórios do localStorage:', error);
  }
  return [];
};

export const saveReportsToStorage = (reports: any[]) => {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Erro ao salvar relatórios no localStorage:', error);
  }
};

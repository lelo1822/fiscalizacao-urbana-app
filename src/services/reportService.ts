
import type { MapMarker } from "@/types/map";
import type { Report } from "@/types/dashboard";

// Chave para armazenar relatórios no localStorage
const REPORTS_STORAGE_KEY = 'camaraRua_reports';

// Função para carregar relatórios do localStorage
const loadReportsFromStorage = (): Report[] => {
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

// Função para salvar relatórios no localStorage
const saveReportsToStorage = (reports: Report[]) => {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Erro ao salvar relatórios no localStorage:', error);
  }
};

// Array para armazenar os relatórios (inicializado do localStorage)
let reports: Report[] = loadReportsFromStorage();

// Se não houver relatórios no storage, adiciona alguns exemplos
if (reports.length === 0) {
  // Exemplos de relatórios
  const exampleReports: Report[] = [
    {
      id: 1,
      type: 'Buraco na via',
      description: 'Buraco grande na avenida principal causando problemas no tráfego',
      address: 'Av. Brasil, 1500, Centro',
      status: 'Pendente',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
      coordinates: { lat: -23.55052, lng: -46.633308 },
      photos: ['/images/pothole.jpg'],
      complainant: {
        fullName: 'José Silva',
        phone: '(11) 98765-4321',
        whatsapp: '',
        address: 'Rua das Flores, 123'
      }
    },
    {
      id: 2,
      type: 'Lâmpada queimada',
      description: 'Poste com lâmpada queimada há 3 dias deixando a rua escura',
      address: 'Rua das Flores, 123, Jardim América',
      status: 'Em andamento',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 dias atrás
      coordinates: { lat: -23.55352, lng: -46.636308 },
      photos: ['/images/streetlight.jpg'],
      complainant: {
        fullName: 'Maria Oliveira',
        phone: '(11) 91234-5678',
        whatsapp: '(11) 91234-5678',
        address: 'Av. Paulista, 1000'
      }
    },
    {
      id: 3,
      type: 'Lixo/Entulho',
      description: 'Acúmulo de lixo na calçada impedindo passagem de pedestres',
      address: 'Rua dos Pinheiros, 456, Pinheiros',
      status: 'Resolvido',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 dias atrás
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 dias atrás
      coordinates: { lat: -23.55752, lng: -46.639308 },
      photos: ['/images/trash.jpg'],
      resolution: {
        description: 'Lixo removido e área limpa',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        responsible: 'Equipe de Limpeza Urbana'
      },
      complainant: {
        fullName: 'Carlos Mendes',
        phone: '(11) 97777-8888',
        whatsapp: '',
        address: 'Alameda Santos, 500'
      }
    }
  ];
  
  reports = exampleReports;
  saveReportsToStorage(reports);
}

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
  const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
  
  const newReport = {
    ...report,
    id: newId,
    createdAt: new Date().toISOString()
  };
  
  reports.push(newReport);
  saveReportsToStorage(reports);
  return newReport;
};

// Função para obter um relatório por ID
export const getReportById = (id: number): Report | undefined => {
  return reports.find(report => report.id === id);
};

// Função para atualizar o status de um relatório
export const updateReportStatus = (id: number, status: string, resolution?: { description: string, responsible: string }): boolean => {
  const report = reports.find(report => report.id === id);
  
  if (report) {
    report.status = status;
    report.updatedAt = new Date().toISOString();
    
    if (status === "Resolvido" && resolution) {
      report.resolution = {
        ...resolution,
        date: new Date().toISOString()
      };
    }
    
    saveReportsToStorage(reports);
    return true;
  }
  
  return false;
};

// Função para deletar um relatório
export const deleteReport = (id: number): boolean => {
  const initialLength = reports.length;
  reports = reports.filter(report => report.id !== id);
  
  if (reports.length !== initialLength) {
    saveReportsToStorage(reports);
    return true;
  }
  
  return false;
};

// Função para buscar relatórios com texto de pesquisa
export const searchReports = (searchText: string): Report[] => {
  if (!searchText || searchText.trim() === '') {
    return reports;
  }
  
  const lowerSearchText = searchText.toLowerCase();
  
  return reports.filter(report => 
    report.type.toLowerCase().includes(lowerSearchText) ||
    report.description.toLowerCase().includes(lowerSearchText) ||
    report.address.toLowerCase().includes(lowerSearchText) ||
    (report.complainant?.fullName && report.complainant.fullName.toLowerCase().includes(lowerSearchText))
  );
};

// Função para obter todos os tipos únicos de relatórios
export const getUniqueReportTypes = (): string[] => {
  const types = new Set(reports.map(report => report.type));
  return Array.from(types);
};

// Função para atualizar dados do dashboard em tempo real
export const getDashboardStats = () => {
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

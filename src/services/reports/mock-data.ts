
import type { Report } from "@/types/dashboard";
import { loadReportsFromStorage, saveReportsToStorage } from "./storage";

// Initialize reports from storage or with mock data if empty
export const initializeReports = (): Report[] => {
  const reports = loadReportsFromStorage();
  
  // If no reports exist in storage, create sample reports
  if (reports.length === 0) {
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
    
    saveReportsToStorage(exampleReports);
    return exampleReports;
  }
  
  return reports;
};

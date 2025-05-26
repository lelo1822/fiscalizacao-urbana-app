
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/dashboard';

export class SupabaseReportService {
  
  static async getAllReports(): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles:agent_id (
            id,
            name,
            gabinete_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(report => ({
        id: report.id,
        type: report.type,
        description: report.description,
        address: report.address,
        coordinates: typeof report.coordinates === 'object' && report.coordinates !== null 
          ? report.coordinates as { lat: number; lng: number }
          : { lat: 0, lng: 0 },
        status: report.status,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        photos: report.photos || [],
        complainant: typeof report.complainant === 'object' && report.complainant !== null
          ? report.complainant as { fullName: string; phone: string; whatsapp?: string; address: string }
          : { fullName: '', phone: '', address: '' },
        resolution: typeof report.resolution === 'object' && report.resolution !== null
          ? report.resolution as any
          : undefined,
        agent: report.profiles ? {
          id: report.profiles.id,
          name: report.profiles.name,
          gabineteId: report.profiles.gabinete_id
        } : undefined
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      return [];
    }
  }

  static async createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('reports')
        .insert({
          type: report.type,
          description: report.description,
          address: report.address,
          coordinates: report.coordinates || { lat: 0, lng: 0 },
          status: report.status || 'Pendente',
          photos: report.photos || [],
          complainant: report.complainant,
          agent_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        description: data.description,
        address: data.address,
        coordinates: typeof data.coordinates === 'object' && data.coordinates !== null 
          ? data.coordinates as { lat: number; lng: number }
          : { lat: 0, lng: 0 },
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        photos: data.photos || [],
        complainant: typeof data.complainant === 'object' && data.complainant !== null
          ? data.complainant as { fullName: string; phone: string; whatsapp?: string; address: string }
          : { fullName: '', phone: '', address: '' },
        resolution: typeof data.resolution === 'object' && data.resolution !== null
          ? data.resolution as any
          : undefined,
        agent: {
          id: user.id,
          name: 'Usuário',
          gabineteId: '1'
        }
      };
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      return null;
    }
  }

  static async updateReportStatus(id: number, status: string, resolution?: any): Promise<boolean> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (resolution) {
        updateData.resolution = resolution;
      }

      const { error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status do relatório:', error);
      return false;
    }
  }

  static async deleteReport(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
      return false;
    }
  }

  static async getReportById(id: number): Promise<Report | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles:agent_id (
            id,
            name,
            gabinete_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        description: data.description,
        address: data.address,
        coordinates: typeof data.coordinates === 'object' && data.coordinates !== null 
          ? data.coordinates as { lat: number; lng: number }
          : { lat: 0, lng: 0 },
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        photos: data.photos || [],
        complainant: typeof data.complainant === 'object' && data.complainant !== null
          ? data.complainant as { fullName: string; phone: string; whatsapp?: string; address: string }
          : { fullName: '', phone: '', address: '' },
        resolution: typeof data.resolution === 'object' && data.resolution !== null
          ? data.resolution as any
          : undefined,
        agent: data.profiles ? {
          id: data.profiles.id,
          name: data.profiles.name,
          gabineteId: data.profiles.gabinete_id
        } : undefined
      };
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      return null;
    }
  }
}

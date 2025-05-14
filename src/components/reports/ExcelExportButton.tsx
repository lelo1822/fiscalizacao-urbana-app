
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Report } from '@/types/dashboard';
import * as XLSX from 'xlsx';

interface ExcelExportButtonProps {
  reports: Report[];
  fileName?: string;
  isLoading?: boolean;
}

const ExcelExportButton = ({ 
  reports, 
  fileName = 'ocorrencias', 
  isLoading = false 
}: ExcelExportButtonProps) => {
  
  const handleExport = () => {
    try {
      if (!reports || reports.length === 0) {
        toast({
          title: "Nenhuma ocorrência para exportar",
          description: "Não há ocorrências disponíveis para exportar.",
          variant: "destructive",
        });
        return;
      }
      
      // Formatar dados para Excel
      const exportData = reports.map(report => ({
        ID: report.id,
        Tipo: report.type,
        Descrição: report.description,
        Endereço: report.address,
        Status: report.status,
        'Data de Criação': new Date(report.createdAt).toLocaleDateString('pt-BR'),
        'Nome do Reclamante': report.complainant?.fullName || 'Não informado',
        'Telefone': report.complainant?.phone || 'Não informado',
        'WhatsApp': report.complainant?.whatsapp || 'Não informado',
        'Endereço do Reclamante': report.complainant?.address || 'Não informado',
        'Agente Responsável': report.agent?.name || 'Não atribuído',
        'Gabinete': report.agent?.gabineteId || 'Não atribuído'
      }));
      
      // Criar planilha
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ocorrências');
      
      // Configurar larguras de coluna
      const columnWidths = [
        { wch: 5 },  // ID
        { wch: 20 }, // Tipo
        { wch: 40 }, // Descrição
        { wch: 30 }, // Endereço
        { wch: 15 }, // Status
        { wch: 15 }, // Data
        { wch: 25 }, // Nome Reclamante
        { wch: 15 }, // Telefone
        { wch: 15 }, // WhatsApp
        { wch: 30 }, // Endereço Reclamante
        { wch: 20 }, // Agente
        { wch: 10 }, // Gabinete
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Gerar nome do arquivo com data
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const fullFileName = `${fileName}_${dateStr}.xlsx`;
      
      // Exportar para Excel
      XLSX.writeFile(workbook, fullFileName);
      
      toast({
        title: "Exportado com sucesso!",
        description: `As ocorrências foram exportadas para ${fullFileName}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar as ocorrências para Excel.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button
      onClick={handleExport}
      disabled={isLoading || reports.length === 0}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Exportar para Excel
    </Button>
  );
};

export default ExcelExportButton;

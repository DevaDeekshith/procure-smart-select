
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/types/supplier';

interface VoiceCommandProcessorProps {
  suppliers: Supplier[];
  onAddSupplier?: (supplierData: any) => void;
  onEditSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (supplierId: string) => void;
  onScoreSupplier?: (supplierId: string, scores: any) => void;
  onGenerateReport?: (reportType: string) => void;
  onNavigate?: (view: string) => void;
}

export const VoiceCommandProcessor = ({
  suppliers,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onScoreSupplier,
  onGenerateReport,
  onNavigate
}: VoiceCommandProcessorProps) => {
  const { toast } = useToast();

  const findSupplierByName = (name: string): Supplier | undefined => {
    return suppliers.find(supplier => 
      supplier.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(supplier.name.toLowerCase())
    );
  };

  const processCommand = (command: any) => {
    const { action, data } = command;

    try {
      switch (action) {
        case 'add_supplier':
          if (onAddSupplier) {
            const supplierData = {
              name: data.supplierName || 'New Supplier',
              industry: data.industry || 'Technology',
              status: 'pending' as const,
              contactEmail: data.email || '',
              contactPhone: data.phone || '',
              address: data.address || '',
              website: data.website || '',
              description: data.description || 'Added via voice command'
            };
            onAddSupplier(supplierData);
            
            toast({
              title: "Supplier Added",
              description: `${supplierData.name} has been added successfully`,
            });
          }
          break;

        case 'edit_supplier':
          if (onEditSupplier && data.supplierName) {
            const supplier = findSupplierByName(data.supplierName);
            if (supplier) {
              const updatedSupplier = {
                ...supplier,
                ...data,
                updatedAt: new Date()
              };
              onEditSupplier(updatedSupplier);
              
              toast({
                title: "Supplier Updated",
                description: `${supplier.name} has been updated successfully`,
              });
            } else {
              toast({
                title: "Supplier Not Found",
                description: `Could not find supplier "${data.supplierName}"`,
                variant: "destructive",
              });
            }
          }
          break;

        case 'delete_supplier':
          if (onDeleteSupplier && data.supplierName) {
            const supplier = findSupplierByName(data.supplierName);
            if (supplier) {
              onDeleteSupplier(supplier.id);
              
              toast({
                title: "Supplier Deleted",
                description: `${supplier.name} has been deleted successfully`,
              });
            } else {
              toast({
                title: "Supplier Not Found",
                description: `Could not find supplier "${data.supplierName}"`,
                variant: "destructive",
              });
            }
          }
          break;

        case 'score_supplier':
          if (onScoreSupplier && data.supplierName && data.score) {
            const supplier = findSupplierByName(data.supplierName);
            if (supplier) {
              const scoreData = {
                criteriaId: data.criteria || 'quality',
                score: data.score,
                comments: `Score added via voice command`
              };
              onScoreSupplier(supplier.id, scoreData);
              
              toast({
                title: "Score Added",
                description: `Scored ${supplier.name} ${data.score} points for ${data.criteria || 'overall'}`,
              });
            } else {
              toast({
                title: "Supplier Not Found",
                description: `Could not find supplier "${data.supplierName}"`,
                variant: "destructive",
              });
            }
          }
          break;

        case 'generate_report':
          if (onGenerateReport) {
            const reportType = data.reportType || 'supplier';
            onGenerateReport(reportType);
            
            toast({
              title: "Report Generated",
              description: `${reportType} report has been generated`,
            });
          }
          break;

        case 'navigate':
          if (onNavigate) {
            const view = data.view || data.section || 'grid';
            onNavigate(view);
            
            toast({
              title: "Navigation",
              description: `Switched to ${view} view`,
            });
          }
          break;

        default:
          toast({
            title: "Unknown Command",
            description: "Voice command was not recognized",
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: "Command Error",
        description: "Failed to process voice command",
        variant: "destructive",
      });
    }
  };

  return null; // This is a logic-only component
};

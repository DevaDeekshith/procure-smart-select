
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Supplier } from '@/types/supplier';
import { websiteContextService, WebsiteContext } from '@/services/websiteContextService';

interface WebsiteContextProviderProps {
  children: ReactNode;
  suppliers: Supplier[];
  currentView: string;
}

const WebsiteContextContext = createContext<{
  context: WebsiteContext | null;
  updateContext: (context: Partial<WebsiteContext>) => void;
} | null>(null);

export const WebsiteContextProvider = ({ 
  children, 
  suppliers, 
  currentView 
}: WebsiteContextProviderProps) => {
  const [context, setContext] = useState<WebsiteContext | null>(null);

  const updateContext = (newContext: Partial<WebsiteContext>) => {
    websiteContextService.updateContext(newContext);
    setContext(websiteContextService.getContext());
  };

  useEffect(() => {
    // Calculate statistics
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const pendingSuppliers = suppliers.filter(s => s.status === 'pending').length;
    const inactiveSuppliers = suppliers.filter(s => s.status === 'inactive').length;
    const rejectedSuppliers = suppliers.filter(s => s.status === 'rejected').length;

    // Calculate average scores
    const averageScores: Record<string, number> = {};
    const criteriaSet = new Set<string>();
    
    suppliers.forEach(supplier => {
      if (supplier.scores) {
        Object.keys(supplier.scores).forEach(criteria => criteriaSet.add(criteria));
      }
    });

    criteriaSet.forEach(criteria => {
      const scores = suppliers
        .map(s => s.scores?.[criteria])
        .filter((score): score is number => typeof score === 'number');
      
      if (scores.length > 0) {
        averageScores[criteria] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    });

    // Generate recent activity
    const recentActivity = [
      `Last updated: ${new Date().toLocaleString()}`,
      `Current view: ${currentView}`,
      `Total suppliers managed: ${suppliers.length}`,
      activeSuppliers > 0 ? `${activeSuppliers} suppliers are currently active` : '',
      pendingSuppliers > 0 ? `${pendingSuppliers} suppliers are pending review` : ''
    ].filter(Boolean);

    const newContext: WebsiteContext = {
      suppliers,
      currentView,
      totalSuppliers: suppliers.length,
      activeSuppliers,
      pendingSuppliers,
      rejectedSuppliers,
      averageScores,
      recentActivity,
      availableViews: ['Grid View', 'Matrix View', 'Analytics Dashboard', 'Supplier List'],
      evaluationCriteria: Array.from(criteriaSet)
    };

    updateContext(newContext);
  }, [suppliers, currentView]);

  return (
    <WebsiteContextContext.Provider value={{ context, updateContext }}>
      {children}
    </WebsiteContextContext.Provider>
  );
};

export const useWebsiteContext = () => {
  const context = useContext(WebsiteContextContext);
  if (!context) {
    throw new Error('useWebsiteContext must be used within a WebsiteContextProvider');
  }
  return context;
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FinancialHubState {
  // Fullscreen states for modules
  isFullscreen: {
    budgetAnalysis: boolean;
    cashFlow: boolean;
    budgetSnapshot: boolean;
    changeOrders: boolean;
    retention: boolean;
  };
  
  // Collapse states
  isCollapsed: {
    kpiSections: boolean;
    insightsPanels: boolean;
  };
  
  // Filter and view preferences
  preferences: {
    budgetView: 'table' | 'chart';
    cashFlowPeriod: '3months' | '6months' | '12months';
    budgetSnapshotSort: 'costCode' | 'budget' | 'variance';
    exportFormats: ('pdf' | 'excel' | 'csv')[];
  };
  
  // Actions
  toggleFullscreen: (module: keyof FinancialHubState['isFullscreen']) => void;
  toggleCollapse: (section: keyof FinancialHubState['isCollapsed']) => void;
  updatePreference: <K extends keyof FinancialHubState['preferences']>(
    key: K,
    value: FinancialHubState['preferences'][K]
  ) => void;
  resetState: () => void;
}

const initialState = {
  isFullscreen: {
    budgetAnalysis: false,
    cashFlow: false,
    budgetSnapshot: false,
    changeOrders: false,
    retention: false,
  },
  isCollapsed: {
    kpiSections: false,
    insightsPanels: false,
  },
  preferences: {
    budgetView: 'table' as const,
    cashFlowPeriod: '6months' as const,
    budgetSnapshotSort: 'costCode' as const,
    exportFormats: ['pdf', 'excel'] as ('pdf' | 'excel' | 'csv')[],
  },
};

export const useFinancialHubStore = create<FinancialHubState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleFullscreen: (module) =>
        set((state) => ({
          isFullscreen: {
            ...state.isFullscreen,
            [module]: !state.isFullscreen[module],
          },
        })),
      
      toggleCollapse: (section) =>
        set((state) => ({
          isCollapsed: {
            ...state.isCollapsed,
            [section]: !state.isCollapsed[section],
          },
        })),
      
      updatePreference: (key, value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        })),
      
      resetState: () => set(initialState),
    }),
    {
      name: 'financial-hub-storage',
      version: 1,
    }
  )
); 
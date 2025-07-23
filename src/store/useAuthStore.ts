import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister, logout as apiLogout, createDemoAccount } from '@/lib/api';

export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  registration: string;
  prefs: Record<string, any>;
  accessedAt: string;
}

export interface ImportedDataset {
  id: string;
  name: string;
  type: 'fish' | 'plant';
  uploadedAt: string;
  size: number;
  records: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  importedDatasets: ImportedDataset[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
  addImportedDataset: (dataset: ImportedDataset) => void;
  removeImportedDataset: (id: string) => void;
  clearImportedDatasets: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    importedDatasets: [],

    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const user = await apiLogin(email, password);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    register: async (email: string, password: string, name: string) => {
      set({ isLoading: true });
      try {
        const user = await apiRegister(email, password, name);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await apiLogout();
        set({ user: null, isAuthenticated: false, isLoading: false, importedDatasets: [] });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    loginDemo: async () => {
      set({ isLoading: true });
      try {
        const user = await createDemoAccount();
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    addImportedDataset: (dataset: ImportedDataset) => {
      set(state => ({
        importedDatasets: [...state.importedDatasets, dataset]
      }));
    },

    removeImportedDataset: (id: string) => {
      set(state => ({
        importedDatasets: state.importedDatasets.filter(d => d.id !== id)
      }));
    },

    clearImportedDatasets: () => {
      set({ importedDatasets: [] });
    }
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      importedDatasets: state.importedDatasets
    })
  }
));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SensorData {
  id: string;
  deviceId: string;
  timestamp: string;
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  waterLevel: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  phosphate?: number;
  salinity?: number;
  conductivity?: number;
}

export interface DeviceStatus {
  id: string;
  name: string;
  type: 'esp32' | 'sensor' | 'pump' | 'light';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
  location?: string;
  firmware?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  deviceId?: string;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'aquaponics' | 'hydroponics' | 'aquaculture';
  createdAt: string;
  updatedAt: string;
  devices: string[];
  settings: {
    targetPh: { min: number; max: number };
    targetTemperature: { min: number; max: number };
    targetDO: { min: number; max: number };
    alertThresholds: {
      ph: { min: number; max: number };
      temperature: { min: number; max: number };
      dissolvedOxygen: { min: number; max: number };
    };
  };
}

interface AppState {
  // Sensor Data
  sensorData: SensorData[];
  latestSensorData: Record<string, SensorData>;
  addSensorData: (data: SensorData) => void;
  getSensorDataByDevice: (deviceId: string) => SensorData[];
  
  // Device Management
  devices: DeviceStatus[];
  updateDeviceStatus: (device: DeviceStatus) => void;
  getDeviceById: (id: string) => DeviceStatus | undefined;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlert: (id: string) => void;
  getUnacknowledgedAlerts: () => Alert[];
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  
  // WebSocket Connection
  isConnected: boolean;
  setConnectionStatus: (status: boolean) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>()(persist(
  (set, get) => ({
    // Sensor Data
    sensorData: [],
    latestSensorData: {},
    
    addSensorData: (data: SensorData) => {
      set(state => ({
        sensorData: [...state.sensorData.slice(-999), data], // Keep last 1000 readings
        latestSensorData: {
          ...state.latestSensorData,
          [data.deviceId]: data
        }
      }));
    },
    
    getSensorDataByDevice: (deviceId: string) => {
      return get().sensorData.filter(data => data.deviceId === deviceId);
    },
    
    // Device Management
    devices: [],
    
    updateDeviceStatus: (device: DeviceStatus) => {
      set(state => {
        const existingIndex = state.devices.findIndex(d => d.id === device.id);
        if (existingIndex >= 0) {
          const newDevices = [...state.devices];
          newDevices[existingIndex] = device;
          return { devices: newDevices };
        } else {
          return { devices: [...state.devices, device] };
        }
      });
    },
    
    getDeviceById: (id: string) => {
      return get().devices.find(device => device.id === id);
    },
    
    // Alerts
    alerts: [],
    
    addAlert: (alert) => {
      const newAlert: Alert = {
        ...alert,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      set(state => ({ alerts: [newAlert, ...state.alerts] }));
    },
    
    acknowledgeAlert: (id: string) => {
      set(state => ({
        alerts: state.alerts.map(alert => 
          alert.id === id ? { ...alert, acknowledged: true } : alert
        )
      }));
    },
    
    clearAlert: (id: string) => {
      set(state => ({
        alerts: state.alerts.filter(alert => alert.id !== id)
      }));
    },
    
    getUnacknowledgedAlerts: () => {
      return get().alerts.filter(alert => !alert.acknowledged);
    },
    
    // Projects
    projects: [],
    currentProject: null,
    
    addProject: (projectData) => {
      const newProject: Project = {
        ...projectData,
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      set(state => ({ projects: [...state.projects, newProject] }));
    },
    
    updateProject: (id: string, updates) => {
      set(state => ({
        projects: state.projects.map(project => 
          project.id === id 
            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
            : project
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() }
          : state.currentProject
      }));
    },
    
    deleteProject: (id: string) => {
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      }));
    },
    
    setCurrentProject: (project: Project | null) => {
      set({ currentProject: project });
    },
    
    // WebSocket Connection
    isConnected: false,
    setConnectionStatus: (status: boolean) => set({ isConnected: status }),
    
    // UI State
    sidebarCollapsed: false,
    toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  }),
  {
    name: 'app-storage',
    partialize: (state) => ({
      projects: state.projects,
      currentProject: state.currentProject,
      sidebarCollapsed: state.sidebarCollapsed,
      devices: state.devices
    })
  }
));
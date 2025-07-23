// ESP32 API Service for device health monitoring and sensor data

export interface ESP32HealthStatus {
  deviceMac: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
  uptime?: number;
  freeMemory?: number;
  temperature?: number;
}

export interface ESP32SensorData {
  deviceMac: string;
  timestamp: string;
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  batteryLevel?: number;
  signalStrength?: number;
}

class ESP32ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_ESP32_API_URL || 'http://localhost:3002';
    this.apiKey = import.meta.env.VITE_ESP32_API_KEY || 'esp32-api-key';
  }

  // Mock implementation for development
  async getDeviceHealth(deviceMac: string): Promise<ESP32HealthStatus> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // Mock different device states
    const mockStates = [
      {
        deviceMac,
        status: 'online' as const,
        lastSeen: new Date().toISOString(),
        batteryLevel: 85 + Math.random() * 15,
        signalStrength: -45 - Math.random() * 20,
        uptime: Math.floor(Math.random() * 86400),
        freeMemory: 150000 + Math.random() * 50000,
        temperature: 22 + Math.random() * 6
      },
      {
        deviceMac,
        status: 'warning' as const,
        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        batteryLevel: 15 + Math.random() * 20,
        signalStrength: -75 - Math.random() * 15,
        uptime: Math.floor(Math.random() * 86400),
        freeMemory: 50000 + Math.random() * 30000,
        temperature: 28 + Math.random() * 4
      },
      {
        deviceMac,
        status: 'offline' as const,
        lastSeen: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        batteryLevel: 5,
        signalStrength: -90,
        uptime: 0,
        freeMemory: 0,
        temperature: 0
      }
    ];

    // Return random state for demo purposes
    return mockStates[Math.floor(Math.random() * mockStates.length)];
  }

  async getSensorData(deviceMac: string, limit: number = 50): Promise<ESP32SensorData[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 300));

    const data: ESP32SensorData[] = [];
    const now = Date.now();

    for (let i = 0; i < limit; i++) {
      const timestamp = new Date(now - (i * 60000)).toISOString(); // 1 minute intervals
      
      data.push({
        deviceMac,
        timestamp,
        temperature: 20 + Math.random() * 8 + Math.sin(i * 0.1) * 2,
        ph: 7.0 + Math.random() * 1.5 + Math.sin(i * 0.05) * 0.5,
        dissolvedOxygen: 6 + Math.random() * 3 + Math.sin(i * 0.08) * 1,
        turbidity: 2 + Math.random() * 3 + Math.sin(i * 0.12) * 1,
        ammonia: Math.random() * 0.8 + Math.sin(i * 0.15) * 0.2,
        nitrite: Math.random() * 0.5 + Math.sin(i * 0.18) * 0.1,
        nitrate: Math.random() * 20 + Math.sin(i * 0.06) * 5,
        batteryLevel: 80 + Math.random() * 20,
        signalStrength: -50 - Math.random() * 30
      });
    }

    return data.reverse(); // Return chronological order
  }

  async sendCommand(deviceMac: string, command: string, params?: any): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    console.log(`Sending command to ${deviceMac}:`, command, params);
    
    // Mock success rate (90%)
    return Math.random() > 0.1;
  }

  async calibrateSensor(deviceMac: string, sensorType: string, calibrationData: any): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    console.log(`Calibrating ${sensorType} sensor on ${deviceMac}:`, calibrationData);
    
    // Mock success rate (85%)
    return Math.random() > 0.15;
  }

  async updateFirmware(deviceMac: string, firmwareUrl: string): Promise<boolean> {
    // Simulate network delay for firmware update
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    console.log(`Updating firmware on ${deviceMac} from:`, firmwareUrl);
    
    // Mock success rate (95%)
    return Math.random() > 0.05;
  }

  async restartDevice(deviceMac: string): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    console.log(`Restarting device:`, deviceMac);
    
    // Mock success rate (98%)
    return Math.random() > 0.02;
  }
}

// Export singleton instance
export const esp32ApiService = new ESP32ApiService();
export default esp32ApiService;
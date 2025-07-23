// ESP32 Device Onboarding API

export interface ESP32Device {
  mac: string;
  name: string;
  type: 'fish' | 'plant';
  location: string;
  apiKey: string;
  status: 'pending' | 'active' | 'inactive';
  lastSeen?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface SensorData {
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

export interface HeartbeatData {
  deviceMac: string;
  timestamp: string;
  status: 'online' | 'warning' | 'error';
  batteryLevel?: number;
  signalStrength?: number;
  freeMemory?: number;
  uptime?: number;
}

export interface DeviceCredentials {
  ssid: string;
  password: string;
  apiEndpoint: string;
  apiKey: string;
  deviceMac: string;
  deviceType: 'fish' | 'plant';
}

class ESP32OnboardingAPI {
  private baseUrl: string;
  private apiKey: string;
  private devices: Map<string, ESP32Device> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_ONBOARDING_API_URL || 'http://localhost:3003';
    this.apiKey = import.meta.env.VITE_ONBOARDING_API_KEY || 'onboarding-api-key';
    this.loadDeviceCredentials();
  }

  private loadDeviceCredentials() {
    // Load saved device credentials from localStorage
    const savedDevices = localStorage.getItem('esp32_devices');
    if (savedDevices) {
      try {
        const devices = JSON.parse(savedDevices);
        devices.forEach((device: ESP32Device) => {
          this.devices.set(device.mac, device);
        });
      } catch (error) {
        console.error('Error loading device credentials:', error);
      }
    }
  }

  private saveDeviceCredentials() {
    const devices = Array.from(this.devices.values());
    localStorage.setItem('esp32_devices', JSON.stringify(devices));
  }

  // Generate API key for device
  generateApiKey(deviceMac: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `esp32_${deviceMac.replace(/:/g, '')}_${timestamp}_${random}`;
  }

  // Validate API key
  validateApiKey(apiKey: string, deviceMac: string): boolean {
    const device = this.devices.get(deviceMac);
    return device ? device.apiKey === apiKey : false;
  }

  // Onboard new device
  async onboardDevice(deviceInfo: {
    mac: string;
    name: string;
    type: 'fish' | 'plant';
    location: string;
    wifiCredentials: {
      ssid: string;
      password: string;
    };
  }): Promise<DeviceCredentials> {
    try {
      // Generate API key for the device
      const apiKey = this.generateApiKey(deviceInfo.mac);
      
      // Create device record
      const device: ESP32Device = {
        mac: deviceInfo.mac,
        name: deviceInfo.name,
        type: deviceInfo.type,
        location: deviceInfo.location,
        apiKey,
        status: 'pending',
        lastSeen: new Date().toISOString()
      };

      // Store device
      this.devices.set(device.mac, device);
      this.saveDeviceCredentials();

      // Return credentials for ESP32
      const credentials: DeviceCredentials = {
        ssid: deviceInfo.wifiCredentials.ssid,
        password: deviceInfo.wifiCredentials.password,
        apiEndpoint: `${this.baseUrl}/api/v1`,
        apiKey,
        deviceMac: deviceInfo.mac,
        deviceType: deviceInfo.type
      };

      console.log('Device onboarded successfully:', device.mac);
      return credentials;
    } catch (error) {
      console.error('Error onboarding device:', error);
      throw error;
    }
  }

  // Get device by MAC address
  getDevice(mac: string): ESP32Device | undefined {
    return this.devices.get(mac);
  }

  // Get all devices
  getAllDevices(): ESP32Device[] {
    return Array.from(this.devices.values());
  }

  // Update device status
  updateDeviceStatus(mac: string, status: 'pending' | 'active' | 'inactive') {
    const device = this.devices.get(mac);
    if (device) {
      device.status = status;
      device.lastSeen = new Date().toISOString();
      this.devices.set(mac, device);
      this.saveDeviceCredentials();
    }
  }

  // Process sensor data from ESP32
  async processSensorData(data: SensorData): Promise<boolean> {
    try {
      // Validate device
      const device = this.devices.get(data.deviceMac);
      if (!device) {
        console.error('Unknown device:', data.deviceMac);
        return false;
      }

      // Update device last seen
      device.lastSeen = data.timestamp;
      device.status = 'active';
      if (data.batteryLevel) device.batteryLevel = data.batteryLevel;
      if (data.signalStrength) device.signalStrength = data.signalStrength;
      
      this.devices.set(device.mac, device);
      this.saveDeviceCredentials();

      // Forward to main application via WebSocket or API
      this.forwardSensorData(data);

      return true;
    } catch (error) {
      console.error('Error processing sensor data:', error);
      return false;
    }
  }

  // Process heartbeat from ESP32
  async processHeartbeat(data: HeartbeatData): Promise<boolean> {
    try {
      const device = this.devices.get(data.deviceMac);
      if (!device) {
        console.error('Unknown device:', data.deviceMac);
        return false;
      }

      // Update device status
      device.lastSeen = data.timestamp;
      device.status = data.status === 'online' ? 'active' : 'inactive';
      if (data.batteryLevel) device.batteryLevel = data.batteryLevel;
      if (data.signalStrength) device.signalStrength = data.signalStrength;
      
      this.devices.set(device.mac, device);
      this.saveDeviceCredentials();

      // Forward heartbeat to main application
      this.forwardHeartbeat(data);

      return true;
    } catch (error) {
      console.error('Error processing heartbeat:', error);
      return false;
    }
  }

  // Forward sensor data to main application
  private forwardSensorData(data: SensorData) {
    // This would typically send to WebSocket or main API
    console.log('Forwarding sensor data:', data);
    
    // Emit custom event for the main application to listen
    window.dispatchEvent(new CustomEvent('esp32-sensor-data', {
      detail: data
    }));
  }

  // Forward heartbeat to main application
  private forwardHeartbeat(data: HeartbeatData) {
    console.log('Forwarding heartbeat:', data);
    
    // Emit custom event for the main application to listen
    window.dispatchEvent(new CustomEvent('esp32-heartbeat', {
      detail: data
    }));
  }

  // Remove device
  removeDevice(mac: string): boolean {
    const removed = this.devices.delete(mac);
    if (removed) {
      this.saveDeviceCredentials();
    }
    return removed;
  }

  // Generate QR code data for device onboarding
  generateQRCodeData(credentials: DeviceCredentials): string {
    return JSON.stringify({
      ssid: credentials.ssid,
      password: credentials.password,
      apiEndpoint: credentials.apiEndpoint,
      apiKey: credentials.apiKey,
      deviceMac: credentials.deviceMac,
      deviceType: credentials.deviceType
    });
  }

  // Parse QR code data
  parseQRCodeData(qrData: string): DeviceCredentials | null {
    try {
      return JSON.parse(qrData);
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      return null;
    }
  }

  // Check device connectivity
  async checkDeviceConnectivity(mac: string): Promise<boolean> {
    const device = this.devices.get(mac);
    if (!device) return false;

    const lastSeen = new Date(device.lastSeen || 0);
    const now = new Date();
    const timeDiff = now.getTime() - lastSeen.getTime();
    
    // Consider device offline if not seen for more than 5 minutes
    return timeDiff < 5 * 60 * 1000;
  }

  // Get device statistics
  getDeviceStatistics() {
    const devices = this.getAllDevices();
    return {
      total: devices.length,
      active: devices.filter(d => d.status === 'active').length,
      pending: devices.filter(d => d.status === 'pending').length,
      inactive: devices.filter(d => d.status === 'inactive').length,
      fish: devices.filter(d => d.type === 'fish').length,
      plant: devices.filter(d => d.type === 'plant').length
    };
  }
}

// Export singleton instance
export const esp32OnboardingAPI = new ESP32OnboardingAPI();
export default esp32OnboardingAPI;
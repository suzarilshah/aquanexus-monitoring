// WebSocket Server for ESP32 Communication

export interface WebSocketServerConfig {
  port: number;
  host: string;
  apiKey: string;
}

export interface ESP32Message {
  type: 'sensor_data' | 'heartbeat' | 'status_update' | 'error';
  deviceMac: string;
  timestamp: string;
  data: any;
  apiKey: string;
}

class WebSocketServer {
  private config: WebSocketServerConfig;
  private connections: Map<string, WebSocket> = new Map();
  private messageHandlers: Map<string, (message: ESP32Message) => void> = new Map();

  constructor(config: WebSocketServerConfig) {
    this.config = config;
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    this.messageHandlers.set('sensor_data', this.handleSensorData.bind(this));
    this.messageHandlers.set('heartbeat', this.handleHeartbeat.bind(this));
    this.messageHandlers.set('status_update', this.handleStatusUpdate.bind(this));
    this.messageHandlers.set('error', this.handleError.bind(this));
  }

  // Initialize WebSocket server (mock implementation for browser)
  async initialize(): Promise<void> {
    console.log(`WebSocket server initialized on ${this.config.host}:${this.config.port}`);
    
    // In a real implementation, this would set up a WebSocket server
    // For browser environment, we'll simulate the server behavior
    this.simulateESP32Connections();
  }

  // Simulate ESP32 device connections for development
  private simulateESP32Connections() {
    const mockDevices = [
      { mac: '24:6F:28:AB:CD:EF', type: 'fish' },
      { mac: '30:AE:A4:12:34:56', type: 'plant' }
    ];

    mockDevices.forEach(device => {
      this.simulateDeviceConnection(device.mac, device.type);
    });
  }

  private simulateDeviceConnection(deviceMac: string, deviceType: string) {
    console.log(`Simulating ESP32 device connection: ${deviceMac}`);

    // Simulate periodic sensor data
    setInterval(() => {
      this.simulateSensorData(deviceMac, deviceType);
    }, 30000 + Math.random() * 30000); // 30-60 seconds

    // Simulate periodic heartbeat
    setInterval(() => {
      this.simulateHeartbeat(deviceMac);
    }, 60000 + Math.random() * 30000); // 60-90 seconds
  }

  private simulateSensorData(deviceMac: string, deviceType: string) {
    const baseValues = deviceType === 'fish' ? {
      temperature: 24,
      ph: 7.2,
      dissolvedOxygen: 7,
      turbidity: 3,
      ammonia: 0.2,
      nitrite: 0.1,
      nitrate: 10
    } : {
      temperature: 22,
      ph: 6.8,
      dissolvedOxygen: 6,
      turbidity: 2,
      ammonia: 0.3,
      nitrite: 0.15,
      nitrate: 15
    };

    const sensorData = {
      deviceMac,
      timestamp: new Date().toISOString(),
      temperature: baseValues.temperature + (Math.random() - 0.5) * 4,
      ph: baseValues.ph + (Math.random() - 0.5) * 1,
      dissolvedOxygen: baseValues.dissolvedOxygen + (Math.random() - 0.5) * 2,
      turbidity: baseValues.turbidity + (Math.random() - 0.5) * 2,
      ammonia: Math.max(0, baseValues.ammonia + (Math.random() - 0.5) * 0.3),
      nitrite: Math.max(0, baseValues.nitrite + (Math.random() - 0.5) * 0.1),
      nitrate: Math.max(0, baseValues.nitrate + (Math.random() - 0.5) * 8),
      batteryLevel: 70 + Math.random() * 30,
      signalStrength: -50 - Math.random() * 30
    };

    const message: ESP32Message = {
      type: 'sensor_data',
      deviceMac,
      timestamp: sensorData.timestamp,
      data: sensorData,
      apiKey: 'mock-api-key'
    };

    this.handleMessage(message);
  }

  private simulateHeartbeat(deviceMac: string) {
    const heartbeatData = {
      deviceMac,
      timestamp: new Date().toISOString(),
      status: 'online',
      batteryLevel: 70 + Math.random() * 30,
      signalStrength: -50 - Math.random() * 30,
      freeMemory: 150000 + Math.random() * 50000,
      uptime: Math.floor(Math.random() * 86400)
    };

    const message: ESP32Message = {
      type: 'heartbeat',
      deviceMac,
      timestamp: heartbeatData.timestamp,
      data: heartbeatData,
      apiKey: 'mock-api-key'
    };

    this.handleMessage(message);
  }

  // Handle incoming WebSocket message
  private handleMessage(message: ESP32Message) {
    // Validate API key
    if (!this.validateApiKey(message.apiKey, message.deviceMac)) {
      console.error('Invalid API key for device:', message.deviceMac);
      return;
    }

    // Route message to appropriate handler
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.warn('Unknown message type:', message.type);
    }
  }

  // Validate API key for device
  private validateApiKey(apiKey: string, deviceMac: string): boolean {
    // In development, accept mock API key
    if (apiKey === 'mock-api-key') return true;
    
    // In production, validate against stored device credentials
    // This would typically check against a database or credential store
    return true; // Simplified for demo
  }

  // Handle sensor data from ESP32
  private handleSensorData(message: ESP32Message) {
    console.log('Received sensor data from', message.deviceMac, message.data);
    
    // Forward to Appwrite function for processing
    this.forwardToAppwrite('ingest-sensor-data', {
      deviceMac: message.deviceMac,
      sensorData: message.data,
      timestamp: message.timestamp
    });

    // Emit to WebSocket clients
    this.broadcastToClients({
      type: 'sensor_data',
      data: message.data,
      deviceMac: message.deviceMac,
      timestamp: message.timestamp
    });
  }

  // Handle heartbeat from ESP32
  private handleHeartbeat(message: ESP32Message) {
    console.log('Received heartbeat from', message.deviceMac);
    
    // Update device status
    this.updateDeviceStatus(message.deviceMac, 'online', message.data);

    // Emit to WebSocket clients
    this.broadcastToClients({
      type: 'heartbeat',
      data: message.data,
      deviceMac: message.deviceMac,
      timestamp: message.timestamp
    });
  }

  // Handle status update from ESP32
  private handleStatusUpdate(message: ESP32Message) {
    console.log('Received status update from', message.deviceMac, message.data);
    
    // Update device status
    this.updateDeviceStatus(message.deviceMac, message.data.status, message.data);

    // Emit to WebSocket clients
    this.broadcastToClients({
      type: 'device_status',
      data: message.data,
      deviceMac: message.deviceMac,
      timestamp: message.timestamp
    });
  }

  // Handle error from ESP32
  private handleError(message: ESP32Message) {
    console.error('Received error from', message.deviceMac, message.data);
    
    // Create alert
    const alert = {
      id: `error_${Date.now()}`,
      deviceMac: message.deviceMac,
      type: 'device_error',
      severity: 'critical',
      message: message.data.error || 'Device error occurred',
      timestamp: message.timestamp,
      acknowledged: false
    };

    // Emit alert to WebSocket clients
    this.broadcastToClients({
      type: 'alert',
      data: alert,
      deviceMac: message.deviceMac,
      timestamp: message.timestamp
    });
  }

  // Forward data to Appwrite function
  private async forwardToAppwrite(functionName: string, data: any) {
    try {
      // This would typically call an Appwrite function
      console.log(`Forwarding to Appwrite function ${functionName}:`, data);
      
      // Mock implementation
      // In production, this would use the Appwrite Functions SDK
    } catch (error) {
      console.error('Error forwarding to Appwrite:', error);
    }
  }

  // Update device status
  private updateDeviceStatus(deviceMac: string, status: string, data: any) {
    // This would typically update device status in database
    console.log(`Updating device ${deviceMac} status to ${status}`);
  }

  // Broadcast message to all connected WebSocket clients
  private broadcastToClients(message: any) {
    // In browser environment, emit custom event
    window.dispatchEvent(new CustomEvent('websocket-message', {
      detail: message
    }));
  }

  // Send command to ESP32 device
  async sendCommand(deviceMac: string, command: string, params?: any): Promise<boolean> {
    console.log(`Sending command to ${deviceMac}:`, command, params);
    
    // In a real implementation, this would send via WebSocket
    // For now, just log and return success
    return true;
  }

  // Get connected devices
  getConnectedDevices(): string[] {
    return Array.from(this.connections.keys());
  }

  // Shutdown server
  async shutdown(): Promise<void> {
    console.log('Shutting down WebSocket server');
    this.connections.clear();
  }
}

// Export singleton instance
const wsServerConfig: WebSocketServerConfig = {
  port: parseInt(import.meta.env.VITE_WS_PORT || '3001'),
  host: import.meta.env.VITE_WS_HOST || 'localhost',
  apiKey: import.meta.env.VITE_WS_API_KEY || 'websocket-server-key'
};

export const webSocketServer = new WebSocketServer(wsServerConfig);
export default webSocketServer;
import { SensorReading, Alert, Device } from '@/store/useStore';

interface WebSocketMessage {
  type: 'sensor_data' | 'device_status' | 'alert' | 'heartbeat';
  data: any;
  timestamp: string;
  deviceMac?: string;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connection', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.ws = null;
        this.emit('connection', { status: 'disconnected' });
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('connection', { status: 'error', error });
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'sensor_data':
        this.handleSensorData(message.data, message.deviceMac);
        break;
      case 'device_status':
        this.handleDeviceStatus(message.data);
        break;
      case 'alert':
        this.handleAlert(message.data);
        break;
      case 'heartbeat':
        this.handleHeartbeat(message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleSensorData(data: any, deviceMac?: string) {
    const sensorReading: SensorReading = {
      id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceMac: deviceMac || data.deviceMac,
      timestamp: new Date(data.timestamp || Date.now()).toISOString(),
      temperature: data.temperature,
      ph: data.ph,
      dissolvedOxygen: data.dissolvedOxygen,
      turbidity: data.turbidity,
      ammonia: data.ammonia,
      nitrite: data.nitrite,
      nitrate: data.nitrate,
      status: this.determineSensorStatus(data)
    };

    this.emit('sensor_data', sensorReading);
    
    // Check for alerts
    const alerts = this.checkForAlerts(sensorReading);
    alerts.forEach(alert => this.emit('alert', alert));
  }

  private handleDeviceStatus(data: any) {
    const deviceUpdate = {
      mac: data.deviceMac,
      status: data.status,
      lastSeen: new Date(data.timestamp || Date.now()).toISOString(),
      batteryLevel: data.batteryLevel,
      signalStrength: data.signalStrength
    };

    this.emit('device_status', deviceUpdate);
  }

  private handleAlert(data: any) {
    const alert: Alert = {
      id: data.id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deviceMac: data.deviceMac,
      type: data.type,
      severity: data.severity,
      message: data.message,
      timestamp: new Date(data.timestamp || Date.now()).toISOString(),
      acknowledged: false
    };

    this.emit('alert', alert);
  }

  private handleHeartbeat(data: any) {
    this.emit('heartbeat', {
      deviceMac: data.deviceMac,
      timestamp: new Date(data.timestamp || Date.now()).toISOString(),
      status: 'online'
    });
  }

  private determineSensorStatus(data: any): 'normal' | 'warning' | 'critical' {
    const issues = [];
    
    // Temperature checks
    if (data.temperature < 18 || data.temperature > 28) {
      issues.push('temperature');
    }
    
    // pH checks
    if (data.ph < 6.5 || data.ph > 8.5) {
      issues.push('ph');
    }
    
    // Dissolved oxygen checks
    if (data.dissolvedOxygen < 5) {
      issues.push('oxygen');
    }
    
    // Ammonia checks
    if (data.ammonia > 0.5) {
      issues.push('ammonia');
    }
    
    if (issues.length === 0) return 'normal';
    if (issues.length <= 2) return 'warning';
    return 'critical';
  }

  private checkForAlerts(reading: SensorReading): Alert[] {
    const alerts: Alert[] = [];
    
    // Critical temperature
    if (reading.temperature < 15 || reading.temperature > 32) {
      alerts.push({
        id: `temp_alert_${Date.now()}`,
        deviceMac: reading.deviceMac,
        type: 'temperature',
        severity: 'critical',
        message: `Critical temperature: ${reading.temperature}°C`,
        timestamp: reading.timestamp,
        acknowledged: false
      });
    }
    
    // Critical pH
    if (reading.ph < 6.0 || reading.ph > 9.0) {
      alerts.push({
        id: `ph_alert_${Date.now()}`,
        deviceMac: reading.deviceMac,
        type: 'ph',
        severity: 'critical',
        message: `Critical pH level: ${reading.ph}`,
        timestamp: reading.timestamp,
        acknowledged: false
      });
    }
    
    // Low dissolved oxygen
    if (reading.dissolvedOxygen < 3) {
      alerts.push({
        id: `oxygen_alert_${Date.now()}`,
        deviceMac: reading.deviceMac,
        type: 'oxygen',
        severity: 'critical',
        message: `Low dissolved oxygen: ${reading.dissolvedOxygen} mg/L`,
        timestamp: reading.timestamp,
        acknowledged: false
      });
    }
    
    // High ammonia
    if (reading.ammonia > 1.0) {
      alerts.push({
        id: `ammonia_alert_${Date.now()}`,
        deviceMac: reading.deviceMac,
        type: 'ammonia',
        severity: 'critical',
        message: `High ammonia level: ${reading.ammonia} mg/L`,
        timestamp: reading.timestamp,
        acknowledged: false
      });
    }
    
    return alerts;
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect();
    }, delay);
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  public send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CONNECTING:
        return 'connecting';
      default:
        return 'disconnected';
    }
  }
}

// Export singleton instance
export const webSocketManager = new WebSocketManager();
export default webSocketManager;
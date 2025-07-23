import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Fish,
  Leaf,
  Thermometer,
  Wifi,
  WifiOff,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard: React.FC = () => {
  const { 
    devices, 
    alerts, 
    sensorData, 
    latestSensorData, 
    isConnected,
    getUnacknowledgedAlerts,
    acknowledgeAlert 
  } = useStore();
  const { user } = useAuthStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const unacknowledgedAlerts = getUnacknowledgedAlerts();
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;

  // Generate mock data for demonstration
  const generateMockData = () => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: 22 + Math.sin(i * 0.5) * 2 + Math.random() * 0.5,
        ph: 7.0 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.1,
        dissolvedOxygen: 8.5 + Math.sin(i * 0.4) * 1 + Math.random() * 0.2,
        turbidity: 2 + Math.random() * 0.5
      });
    }
    return data;
  };

  const chartData = generateMockData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'error': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'maintenance': return <Zap className="h-4 w-4 text-yellow-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || 'User'}! Here's your aquaponics system overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Alerts ({unacknowledgedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5°C</div>
            <div className="flex items-center text-xs text-gray-600">
              {getTrendIcon(23.5, 23.2)}
              <span className="ml-1">+0.3°C from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pH Level</CardTitle>
            <Droplets className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <div className="flex items-center text-xs text-gray-600">
              {getTrendIcon(7.2, 7.1)}
              <span className="ml-1">+0.1 from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7 mg/L</div>
            <div className="flex items-center text-xs text-gray-600">
              {getTrendIcon(8.7, 8.9)}
              <span className="ml-1">-0.2 mg/L from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((onlineDevices / Math.max(totalDevices, 1)) * 100)}%</div>
            <div className="flex items-center text-xs text-gray-600">
              <span>{onlineDevices}/{totalDevices} devices online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Water Parameters (24h)</CardTitle>
            <CardDescription>
              Real-time monitoring of key water quality indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="ph" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="pH Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dissolved Oxygen & Turbidity</CardTitle>
            <CardDescription>
              Water quality and clarity measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="dissolvedOxygen" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Dissolved Oxygen (mg/L)"
                />
                <Area 
                  type="monotone" 
                  dataKey="turbidity" 
                  stackId="2"
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Turbidity (NTU)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
          <CardDescription>
            Current status of all connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No devices connected</p>
              <p className="text-sm text-gray-500 mt-1">
                Connect your ESP32 devices to start monitoring
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div key={device.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{device.name}</h3>
                    {getStatusIcon(device.status)}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Type: {device.type}</p>
                    <p className={getStatusColor(device.status)}>
                      Status: {device.status}
                    </p>
                    <p>Last seen: {new Date(device.lastSeen).toLocaleString()}</p>
                    {device.batteryLevel && (
                      <p>Battery: {device.batteryLevel}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and system controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Fish className="h-6 w-6 mb-2" />
              <span>Fish Environment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Leaf className="h-6 w-6 mb-2" />
              <span>Plant Environment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="h-6 w-6 mb-2" />
              <span>System Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
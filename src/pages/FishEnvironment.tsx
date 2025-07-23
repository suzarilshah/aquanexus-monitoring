import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import {
  Fish,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FishEnvironment: React.FC = () => {
  const { sensorData, latestSensorData, devices, alerts } = useStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  // Generate mock fish environment data
  const generateFishData = () => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: 24 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.3,
        ph: 7.2 + Math.sin(i * 0.4) * 0.2 + Math.random() * 0.05,
        dissolvedOxygen: 8.5 + Math.sin(i * 0.5) * 0.8 + Math.random() * 0.1,
        ammonia: 0.1 + Math.random() * 0.05,
        nitrite: 0.05 + Math.random() * 0.02,
        nitrate: 5 + Math.random() * 2,
        salinity: 0.5 + Math.random() * 0.1
      });
    }
    return data;
  };

  const fishData = generateFishData();
  const currentData = fishData[fishData.length - 1];
  const previousData = fishData[fishData.length - 2];

  const fishMetrics = [
    {
      name: 'Water Temperature',
      value: `${currentData.temperature.toFixed(1)}°C`,
      trend: currentData.temperature - previousData.temperature,
      optimal: '22-26°C',
      status: currentData.temperature >= 22 && currentData.temperature <= 26 ? 'optimal' : 'warning',
      icon: Thermometer,
      color: 'text-blue-600'
    },
    {
      name: 'pH Level',
      value: currentData.ph.toFixed(1),
      trend: currentData.ph - previousData.ph,
      optimal: '6.8-7.5',
      status: currentData.ph >= 6.8 && currentData.ph <= 7.5 ? 'optimal' : 'warning',
      icon: Droplets,
      color: 'text-green-600'
    },
    {
      name: 'Dissolved Oxygen',
      value: `${currentData.dissolvedOxygen.toFixed(1)} mg/L`,
      trend: currentData.dissolvedOxygen - previousData.dissolvedOxygen,
      optimal: '> 6 mg/L',
      status: currentData.dissolvedOxygen > 6 ? 'optimal' : 'critical',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      name: 'Ammonia (NH₃)',
      value: `${currentData.ammonia.toFixed(2)} ppm`,
      trend: currentData.ammonia - previousData.ammonia,
      optimal: '< 0.25 ppm',
      status: currentData.ammonia < 0.25 ? 'optimal' : 'critical',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  const getTrendIcon = (trend: number) => {
    if (trend > 0.01) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -0.01) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const nitrogenCycleData = [
    { name: 'Ammonia', value: currentData.ammonia, color: '#ef4444' },
    { name: 'Nitrite', value: currentData.nitrite, color: '#f97316' },
    { name: 'Nitrate', value: currentData.nitrate, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Fish className="h-8 w-8 mr-3 text-blue-600" />
            Fish Environment
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor water quality parameters critical for fish health
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fishMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-600">
                    {getTrendIcon(metric.trend)}
                    <span className="ml-1">
                      {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(2)}
                    </span>
                  </div>
                  {getStatusBadge(metric.status)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Optimal: {metric.optimal}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Water Quality Trends (24h)</CardTitle>
            <CardDescription>
              Temperature, pH, and dissolved oxygen levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fishData}>
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
                <Line 
                  type="monotone" 
                  dataKey="dissolvedOxygen" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Dissolved Oxygen (mg/L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nitrogen Cycle</CardTitle>
            <CardDescription>
              Current levels of nitrogen compounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nitrogenCycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={(entry) => entry.color} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fish Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Fish Health Indicators</CardTitle>
          <CardDescription>
            Key parameters affecting fish wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Water Chemistry</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Salinity</span>
                  <span className="font-medium">{currentData.salinity.toFixed(2)}‰</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Alkalinity</span>
                  <span className="font-medium">120 ppm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hardness</span>
                  <span className="font-medium">150 ppm</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Environmental</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water Level</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Flow Rate</span>
                  <span className="font-medium">2.5 L/min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Turbidity</span>
                  <span className="font-medium">1.8 NTU</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Filtration</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aeration</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heater</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fish Environment Alerts</CardTitle>
          <CardDescription>
            Latest alerts related to fish health parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">pH Level Fluctuation</p>
                <p className="text-sm text-yellow-700">pH dropped to 6.7, below optimal range</p>
              </div>
              <span className="text-xs text-yellow-600">2 hours ago</span>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Oxygen Levels Restored</p>
                <p className="text-sm text-green-700">Dissolved oxygen back to optimal levels</p>
              </div>
              <span className="text-xs text-green-600">4 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FishEnvironment;
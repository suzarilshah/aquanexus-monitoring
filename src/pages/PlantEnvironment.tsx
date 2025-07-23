import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import {
  Leaf,
  Sun,
  Droplets,
  Zap,
  Thermometer,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Download,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PlantEnvironment: React.FC = () => {
  const { sensorData, latestSensorData, devices } = useStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Generate mock plant environment data
  const generatePlantData = () => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      const isDayTime = hour >= 6 && hour <= 18;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: 22 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5,
        humidity: 65 + Math.sin(i * 0.4) * 10 + Math.random() * 2,
        lightIntensity: isDayTime ? 800 + Math.random() * 200 : 0,
        ph: 6.0 + Math.sin(i * 0.2) * 0.3 + Math.random() * 0.1,
        ec: 1.8 + Math.sin(i * 0.5) * 0.2 + Math.random() * 0.05,
        nitrogen: 150 + Math.random() * 20,
        phosphorus: 50 + Math.random() * 10,
        potassium: 200 + Math.random() * 30
      });
    }
    return data;
  };

  const plantData = generatePlantData();
  const currentData = plantData[plantData.length - 1];
  const previousData = plantData[plantData.length - 2];

  const plantMetrics = [
    {
      name: 'Air Temperature',
      value: `${currentData.temperature.toFixed(1)}°C`,
      trend: currentData.temperature - previousData.temperature,
      optimal: '20-25°C',
      status: currentData.temperature >= 20 && currentData.temperature <= 25 ? 'optimal' : 'warning',
      icon: Thermometer,
      color: 'text-orange-600'
    },
    {
      name: 'Humidity',
      value: `${currentData.humidity.toFixed(0)}%`,
      trend: currentData.humidity - previousData.humidity,
      optimal: '60-70%',
      status: currentData.humidity >= 60 && currentData.humidity <= 70 ? 'optimal' : 'warning',
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      name: 'Light Intensity',
      value: `${currentData.lightIntensity.toFixed(0)} μmol/m²/s`,
      trend: currentData.lightIntensity - previousData.lightIntensity,
      optimal: '400-800 μmol/m²/s',
      status: currentData.lightIntensity >= 400 && currentData.lightIntensity <= 800 ? 'optimal' : 'warning',
      icon: Sun,
      color: 'text-yellow-600'
    },
    {
      name: 'Nutrient pH',
      value: currentData.ph.toFixed(1),
      trend: currentData.ph - previousData.ph,
      optimal: '5.5-6.5',
      status: currentData.ph >= 5.5 && currentData.ph <= 6.5 ? 'optimal' : 'warning',
      icon: Activity,
      color: 'text-green-600'
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

  const nutrientData = [
    { name: 'Nitrogen (N)', value: currentData.nitrogen, unit: 'ppm', optimal: '150-200', color: '#3b82f6' },
    { name: 'Phosphorus (P)', value: currentData.phosphorus, unit: 'ppm', optimal: '30-50', color: '#8b5cf6' },
    { name: 'Potassium (K)', value: currentData.potassium, unit: 'ppm', optimal: '200-300', color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Leaf className="h-8 w-8 mr-3 text-green-600" />
            Plant Environment
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor growing conditions and nutrient levels for optimal plant health
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
        {plantMetrics.map((metric) => {
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
            <CardTitle>Environmental Conditions (24h)</CardTitle>
            <CardDescription>
              Temperature, humidity, and light intensity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={plantData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Light Cycle</CardTitle>
            <CardDescription>
              Daily light intensity pattern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={plantData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="lightIntensity" 
                  stroke="#eab308" 
                  fill="#eab308"
                  fillOpacity={0.6}
                  name="Light Intensity (μmol/m²/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Nutrient Solution */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrient Solution</CardTitle>
          <CardDescription>
            Current nutrient levels and solution parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Solution Parameters</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">pH Level</span>
                  <span className="font-bold text-lg">{currentData.ph.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">EC (Electrical Conductivity)</span>
                  <span className="font-bold text-lg">{currentData.ec.toFixed(2)} mS/cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">TDS (Total Dissolved Solids)</span>
                  <span className="font-bold text-lg">{(currentData.ec * 640).toFixed(0)} ppm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Water Temperature</span>
                  <span className="font-bold text-lg">{(currentData.temperature - 2).toFixed(1)}°C</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Macronutrients (NPK)</h3>
              <div className="space-y-3">
                {nutrientData.map((nutrient) => (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                      <span className="font-bold">{nutrient.value.toFixed(0)} {nutrient.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: nutrient.color, 
                          width: `${Math.min((nutrient.value / 300) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Optimal: {nutrient.optimal} {nutrient.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growing Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Growing System Status</CardTitle>
          <CardDescription>
            Current status of all growing system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Lighting System</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">LED Panels</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Photoperiod</span>
                  <span className="font-medium">16h/8h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Power Consumption</span>
                  <span className="font-medium">240W</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Irrigation</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Water Pump</span>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Flow Rate</span>
                  <span className="font-medium">3.2 L/min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cycle Timer</span>
                  <span className="font-medium">15min ON / 45min OFF</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Climate Control</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ventilation Fan</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Humidifier</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heater</span>
                  <Badge className="bg-gray-100 text-gray-800">Off</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Plant Growth Monitoring</CardTitle>
          <CardDescription>
            Track different growth stages and their requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center mb-2">
                <Leaf className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Seedling</h3>
              </div>
              <p className="text-sm text-green-700 mb-2">Days 1-14</p>
              <div className="space-y-1 text-xs text-green-600">
                <p>• Light: 200-400 μmol/m²/s</p>
                <p>• EC: 0.8-1.2 mS/cm</p>
                <p>• pH: 5.8-6.2</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Vegetative</h3>
              </div>
              <p className="text-sm text-blue-700 mb-2">Days 15-35</p>
              <div className="space-y-1 text-xs text-blue-600">
                <p>• Light: 400-600 μmol/m²/s</p>
                <p>• EC: 1.2-1.8 mS/cm</p>
                <p>• pH: 5.5-6.0</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-purple-50">
              <div className="flex items-center mb-2">
                <Sun className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Flowering</h3>
              </div>
              <p className="text-sm text-purple-700 mb-2">Days 36-60</p>
              <div className="space-y-1 text-xs text-purple-600">
                <p>• Light: 600-800 μmol/m²/s</p>
                <p>• EC: 1.8-2.2 mS/cm</p>
                <p>• pH: 6.0-6.5</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-orange-50">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-semibold text-orange-800">Harvest</h3>
              </div>
              <p className="text-sm text-orange-700 mb-2">Days 60+</p>
              <div className="space-y-1 text-xs text-orange-600">
                <p>• Light: 400-600 μmol/m²/s</p>
                <p>• EC: 1.0-1.5 mS/cm</p>
                <p>• pH: 6.0-6.5</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantEnvironment;
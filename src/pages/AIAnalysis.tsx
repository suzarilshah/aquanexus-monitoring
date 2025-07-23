import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  Leaf,
  Fish,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AIAnalysis: React.FC = () => {
  const { sensorData, devices, alerts } = useStore();
  const { generateAIInsights } = useAuthStore();
  const [insights, setInsights] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');

  // Mock AI insights data
  const mockInsights = [
    {
      id: 1,
      type: 'optimization',
      title: 'pH Buffer Optimization',
      description: 'AI detected pH fluctuations can be reduced by 23% with adjusted buffer timing.',
      confidence: 92,
      impact: 'high',
      recommendation: 'Increase buffer dosing frequency from 6h to 4h intervals during peak feeding times.',
      category: 'water_quality'
    },
    {
      id: 2,
      type: 'prediction',
      title: 'Temperature Trend Alert',
      description: 'Predictive model indicates water temperature will exceed optimal range in 6-8 hours.',
      confidence: 87,
      impact: 'medium',
      recommendation: 'Activate cooling system preemptively and increase aeration by 15%.',
      category: 'environmental'
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Energy Consumption Pattern',
      description: 'LED lighting schedule can be optimized to reduce energy consumption by 18% without affecting plant growth.',
      confidence: 94,
      impact: 'medium',
      recommendation: 'Adjust photoperiod to 14h/10h cycle with 20% intensity reduction during midday.',
      category: 'energy'
    },
    {
      id: 4,
      type: 'health',
      title: 'Fish Behavior Analysis',
      description: 'Feeding pattern analysis suggests optimal feeding times at 7:30 AM and 5:30 PM for maximum nutrient absorption.',
      confidence: 89,
      impact: 'high',
      recommendation: 'Adjust automatic feeder schedule and reduce portion size by 10%.',
      category: 'fish_health'
    }
  ];

  const systemHealthData = [
    { subject: 'Water Quality', A: 85, fullMark: 100 },
    { subject: 'Fish Health', A: 92, fullMark: 100 },
    { subject: 'Plant Growth', A: 78, fullMark: 100 },
    { subject: 'Energy Efficiency', A: 73, fullMark: 100 },
    { subject: 'System Stability', A: 88, fullMark: 100 },
    { subject: 'Nutrient Balance', A: 81, fullMark: 100 }
  ];

  const performanceMetrics = [
    {
      name: 'System Efficiency',
      current: 87,
      target: 90,
      trend: 'up',
      improvement: '+3%'
    },
    {
      name: 'Fish Growth Rate',
      current: 92,
      target: 95,
      trend: 'up',
      improvement: '+5%'
    },
    {
      name: 'Plant Yield',
      current: 78,
      target: 85,
      trend: 'down',
      improvement: '-2%'
    },
    {
      name: 'Energy Usage',
      current: 73,
      target: 80,
      trend: 'up',
      improvement: '+7%'
    }
  ];

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setInsights(mockInsights);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-5 w-5" />;
      case 'prediction': return <TrendingUp className="h-5 w-5" />;
      case 'efficiency': return <Zap className="h-5 w-5" />;
      case 'health': return <CheckCircle className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            AI Analysis
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent insights and recommendations for your aquaponics system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Analyzing...' : 'Generate Insights'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.current}%</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Target: {metric.target}%</span>
                <span className={`text-xs font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.improvement}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    metric.current >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${metric.current}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
            <CardDescription>
              AI-powered assessment of all system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={systemHealthData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Health Score"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Confidence Levels</CardTitle>
            <CardDescription>
              Reliability of AI predictions and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 4).map((insight) => (
                <div key={insight.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-600">
                      {getTypeIcon(insight.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{insight.title}</p>
                      <p className="text-xs text-gray-600">{insight.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{insight.confidence}%</div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
          <CardDescription>
            Actionable insights generated from your system data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-600">
                      {getTypeIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    <Badge variant="outline">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Recommendation:</p>
                      <p className="text-sm text-blue-700">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>
            AI-powered predictions for the next 24-48 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Environmental Predictions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Water Temperature</span>
                  </div>
                  <span className="text-sm text-green-700">Stable (±0.5°C)</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">pH Level</span>
                  </div>
                  <span className="text-sm text-yellow-700">May drop to 6.8</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Dissolved Oxygen</span>
                  </div>
                  <span className="text-sm text-green-700">Optimal range</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Growth Predictions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Fish className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Fish Growth</span>
                  </div>
                  <span className="text-sm text-blue-700">+2.3% this week</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Plant Yield</span>
                  </div>
                  <span className="text-sm text-green-700">Ready in 12 days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">System Efficiency</span>
                  </div>
                  <span className="text-sm text-purple-700">Improving trend</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Opportunities</CardTitle>
          <CardDescription>
            AI-identified areas for system improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Energy Efficiency</h3>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                Optimize lighting schedule to reduce consumption by 18%
              </p>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                Apply Changes
              </Button>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Nutrient Timing</h3>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Adjust feeding schedule for 15% better nutrient absorption
              </p>
              <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                Schedule Update
              </Button>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center mb-3">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Predictive Maintenance</h3>
              </div>
              <p className="text-sm text-purple-700 mb-2">
                Schedule pump maintenance in 2 weeks based on usage patterns
              </p>
              <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                Set Reminder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalysis;
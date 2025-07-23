import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Upload,
  FileText,
  Database,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface ImportedDataset {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'excel';
  size: number;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  recordCount?: number;
  description?: string;
}

const DataImport: React.FC = () => {
  const { importedDatasets, addImportedDataset } = useAuthStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xlsx');
    });
    
    setSelectedFiles(validFiles);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        // Simulate file upload and processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const dataset: ImportedDataset = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.name.endsWith('.csv') ? 'csv' : file.name.endsWith('.json') ? 'json' : 'excel',
          size: file.size,
          uploadDate: new Date(),
          status: 'completed',
          recordCount: Math.floor(Math.random() * 10000) + 100,
          description: `Imported ${file.type} dataset with sensor readings and environmental data`
        };
        
        addImportedDataset(dataset);
      }
      
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileText className="h-5 w-5 text-green-600" />;
      case 'json': return <Database className="h-5 w-5 text-blue-600" />;
      case 'excel': return <BarChart3 className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Upload className="h-8 w-8 mr-3 text-blue-600" />
            Data Import
          </h1>
          <p className="text-gray-600 mt-1">
            Import historical data and external datasets for analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Import Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Template
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Data Files</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: CSV, JSON, Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Maximum file size: 50MB per file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Select Files
            </Button>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileTypeIcon(file.name.split('.').pop() || '')}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={uploadFiles}
                  disabled={uploading}
                >
                  {uploading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{importedDatasets.length}</div>
            <p className="text-xs text-gray-600">Imported datasets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(importedDatasets.reduce((sum, dataset) => sum + (dataset.recordCount || 0), 0))}
            </div>
            <p className="text-xs text-gray-600">Data points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(importedDatasets.reduce((sum, dataset) => sum + dataset.size, 0))}
            </div>
            <p className="text-xs text-gray-600">Total size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Import</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {importedDatasets.length > 0 
                ? new Date(Math.max(...importedDatasets.map(d => d.uploadDate.getTime()))).toLocaleDateString()
                : 'None'
              }
            </div>
            <p className="text-xs text-gray-600">Most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Imported Datasets */}
      <Card>
        <CardHeader>
          <CardTitle>Imported Datasets</CardTitle>
          <CardDescription>
            Manage and analyze your imported data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importedDatasets.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No datasets imported yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload your first dataset to get started with analysis
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {importedDatasets.map((dataset) => (
                <div key={dataset.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getFileTypeIcon(dataset.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {dataset.description || 'No description available'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Size: {formatFileSize(dataset.size)}</span>
                          {dataset.recordCount && (
                            <span>Records: {formatNumber(dataset.recordCount)}</span>
                          )}
                          <span>Uploaded: {dataset.uploadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(dataset.status)}
                      <Button size="sm" variant="outline">
                        Analyze
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Data Mapping & Validation</CardTitle>
          <CardDescription>
            Configure how imported data maps to your system parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Standard Mappings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Temperature</span>
                  <span className="text-sm font-medium">temp, temperature, water_temp</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">pH Level</span>
                  <span className="text-sm font-medium">ph, pH, ph_level</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Dissolved Oxygen</span>
                  <span className="text-sm font-medium">do, dissolved_oxygen, oxygen</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Timestamp</span>
                  <span className="text-sm font-medium">timestamp, date, time</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Validation Rules</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Temperature Range</span>
                  <Badge className="bg-green-100 text-green-800">0-40°C</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">pH Range</span>
                  <Badge className="bg-green-100 text-green-800">0-14</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">DO Range</span>
                  <Badge className="bg-green-100 text-green-800">0-20 mg/L</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Date Format</span>
                  <Badge className="bg-green-100 text-green-800">ISO 8601</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
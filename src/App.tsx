import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import DashboardLayout from './components/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import FishEnvironment from './pages/FishEnvironment';
import PlantEnvironment from './pages/PlantEnvironment';
import AIAnalysis from './pages/AIAnalysis';
import DataImport from './pages/DataImport';
import './index.css';

function App() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Routes>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="*" element={<LoginForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fish" element={<FishEnvironment />} />
          <Route path="/plants" element={<PlantEnvironment />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
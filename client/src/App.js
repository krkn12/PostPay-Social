import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

// Páginas de Autenticação
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Páginas Principais
import Home from './pages/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Surveys from './pages/Surveys/Surveys';
import SurveyDetail from './pages/Surveys/SurveyDetail';
import StartSurvey from './pages/Surveys/StartSurvey';
import Rewards from './pages/Rewards';
import RewardsStore from './pages/RewardsStore';
import Profile from './pages/Profile';
import CashConversion from './pages/CashConversion';
import Subscription from './pages/Subscription';

// Páginas Administrativas
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <MainLayout>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas Protegidas - Usuários */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/surveys" element={
              <ProtectedRoute>
                <Surveys />
              </ProtectedRoute>
            } />

            <Route path="/surveys/:id" element={
              <ProtectedRoute>
                <SurveyDetail />
              </ProtectedRoute>
            } />

            <Route path="/surveys/:id/start" element={
              <ProtectedRoute>
                <StartSurvey />
              </ProtectedRoute>
            } />
            
            <Route path="/rewards" element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            } />
            
            <Route path="/rewards-store" element={
              <ProtectedRoute>
                <RewardsStore />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/cash-conversion" element={
              <ProtectedRoute>
                <CashConversion />
              </ProtectedRoute>
            } />
            
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            
            {/* Rotas Administrativas */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Redirecionamento para rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </div>
    </AuthProvider>
  );
}

export default App;
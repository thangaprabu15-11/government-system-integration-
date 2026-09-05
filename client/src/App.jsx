import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GovHeader from './components/GovHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AiAssistantPage from './pages/AiAssistantPage';
import ServiceCataloguePage from './pages/ServiceCataloguePage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import EligibilityCheckPage from './pages/EligibilityCheckPage';
import ConsentPage from './pages/ConsentPage';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationReviewPage from './pages/ApplicationReviewPage';
import ApplicationSuccessPage from './pages/ApplicationSuccessPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ConsentHistoryPage from './pages/ConsentHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ApiMonitoringPage from './pages/ApiMonitoringPage';
import AuditLogsPage from './pages/AuditLogsPage';
import DataMapperVisualizer from './components/DataMapperVisualizer';

import { LanguageProvider } from './context/LanguageContext';
import LanguageSelectModal from './components/LanguageSelectModal';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-slate-500">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <LanguageSelectModal />
      <GovHeader />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/interoperability" element={
            <div className="max-w-7xl mx-auto py-8 px-4"><DataMapperVisualizer /></div>
          } />

          {/* Citizen Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><Dashboard /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute allowedRoles={['citizen']}><AiAssistantPage /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute allowedRoles={['citizen']}><ServiceCataloguePage /></ProtectedRoute>} />
          <Route path="/services/:id" element={<ProtectedRoute allowedRoles={['citizen']}><ServiceDetailsPage /></ProtectedRoute>} />
          <Route path="/services/:id/check-eligibility" element={<ProtectedRoute allowedRoles={['citizen']}><EligibilityCheckPage /></ProtectedRoute>} />
          <Route path="/consent-auth" element={<ProtectedRoute allowedRoles={['citizen']}><ConsentPage /></ProtectedRoute>} />
          <Route path="/apply/:serviceId" element={<ProtectedRoute allowedRoles={['citizen']}><ApplicationFormPage /></ProtectedRoute>} />
          <Route path="/apply/:serviceId/review" element={<ProtectedRoute allowedRoles={['citizen']}><ApplicationReviewPage /></ProtectedRoute>} />
          <Route path="/application-success/:applicationId" element={<ProtectedRoute allowedRoles={['citizen']}><ApplicationSuccessPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute allowedRoles={['citizen']}><DocumentsPage /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['citizen']}><MyApplicationsPage /></ProtectedRoute>} />
          <Route path="/my-applications/:id" element={<ProtectedRoute allowedRoles={['citizen']}><ApplicationDetailsPage /></ProtectedRoute>} />
          <Route path="/consent" element={<ProtectedRoute allowedRoles={['citizen']}><ConsentHistoryPage /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'citizen']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/api-monitoring" element={<ProtectedRoute allowedRoles={['admin', 'citizen']}><ApiMonitoringPage /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin', 'citizen']}><AuditLogsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <MainLayout />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

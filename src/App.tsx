import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DemoInspectorModal } from './components/DemoInspectorModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyFieldsPage } from './pages/MyFieldsPage';
import { FieldDetailsPage } from './pages/FieldDetailsPage';
import { FieldRegistrationPage } from './pages/FieldRegistrationPage';
import { ScanCropPage } from './pages/ScanCropPage';
import { ImageQualityCheckPage } from './pages/ImageQualityCheckPage';
import { DiagnosisProcessingPage } from './pages/DiagnosisProcessingPage';
import { DiagnosisResultPage } from './pages/DiagnosisResultPage';
import { ExpertReviewPendingPage } from './pages/ExpertReviewPendingPage';
import { AdvisoryPage } from './pages/AdvisoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { FollowUpPage } from './pages/FollowUpPage';
import { ProfilePage } from './pages/ProfilePage';

// App Layout Shell to conditionally show BottomNav
const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Hide bottom nav on landing, login, register, and processing screens
  const isAuthOrSplash = ['/', '/login', '/register', '/scan/processing'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#f8faf4] flex flex-col font-body text-[#191c19] selection:bg-[#aef2c4] selection:text-[#004527]">
      {/* Universal Top Header */}
      <Header onOpenDemoInspector={() => setIsInspectorOpen(true)} />

      {/* Main Page Routing */}
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fields" element={<MyFieldsPage />} />
          <Route path="/fields/new" element={<FieldRegistrationPage />} />
          <Route path="/fields/:id" element={<FieldDetailsPage />} />
          <Route path="/scan" element={<ScanCropPage />} />
          <Route path="/scan/quality-check" element={<ImageQualityCheckPage />} />
          <Route path="/scan/processing" element={<DiagnosisProcessingPage />} />
          <Route path="/diagnosis/:id" element={<DiagnosisResultPage />} />
          <Route path="/diagnosis/:id/pending" element={<ExpertReviewPendingPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/advisory/:disease" element={<AdvisoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/followup" element={<FollowUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Sticky Bottom Navigation for Mobile & Desktop */}
      {!isAuthOrSplash && <BottomNav />}

      {/* Demo & REST API Inspector Modal */}
      <DemoInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <VoiceProvider>
            <AppLayout />
          </VoiceProvider>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}


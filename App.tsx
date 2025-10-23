import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LegalNoticePage from './pages/LegalNoticePage';
import CookieBanner from './components/CookieBanner';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RafflePage from './pages/RafflePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
          <Toaster position="top-center" reverseOrder={false} />
          <Header />
          <main className="container mx-auto p-4 md:p-8 flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/legal-notice" element={<LegalNoticePage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/raffle" element={<RafflePage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={[Role.FESTERO, Role.ORGANIZER]}>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={[Role.USER, Role.FESTERO, Role.ORGANIZER]}>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
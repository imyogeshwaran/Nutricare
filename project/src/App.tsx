import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import HealthProfile from './pages/HealthProfile';
import AnalyzePage from './pages/AnalyzePage';
import NutrientsPage from './pages/NutrientsPage';
import LearnPage from './pages/LearnPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import RequireAuth from './components/layout/RequireAuth';
import DietPlanPage from './pages/DietPlanPage';

// New Lottie-based global loader
const GlobalLottieLoader: React.FC = () => {
  const { isLoading, message } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center w-72">
        <DotLottieReact
          src="https://lottie.host/99453f9e-7b09-49d9-8fd8-16c9990959a6/h7p02jff4x.json" // Leaf loading animation
          loop
          autoplay
          style={{ width: 120, height: 120, marginBottom: '1rem' }}
        />
        <h3 className="text-emerald-700 text-lg font-semibold text-center">
          {message || 'Loading...'}
        </h3>
        <p className="text-gray-500 text-sm text-center mt-1">Please wait a moment.</p>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();

  return (
    <LoadingProvider>
      <LoadingSpinner /> {/* Existing spinner instance, likely inactive globally unless props are passed */}
      <GlobalLottieLoader /> {/* New Lottie-based global loader */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            } />
            
            <Route path="login" element={<LoginPage />} />
            
            <Route path="register" element={<RegisterPage />} />
            
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            
            <Route path="dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            
            <Route path="profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            
            <Route path="health-profile" element={
              <RequireAuth>
                <HealthProfile />
              </RequireAuth>
            } />
            
            <Route path="analyze" element={
              <RequireAuth>
                <AnalyzePage />
              </RequireAuth>
            } />
            
            <Route path="nutrients" element={
              <RequireAuth>
                <NutrientsPage />
              </RequireAuth>
            } />

            <Route path="learn" element={
              <RequireAuth>
                <LearnPage />
              </RequireAuth>
            } />
            <Route path="learn/:id" element={
              <RequireAuth>
                <ArticleDetailPage />
              </RequireAuth>
            } />
            
            <Route path="diet-plan" element={
              <RequireAuth>
                <DietPlanPage />
              </RequireAuth>
            } />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      
    </LoadingProvider>
  );
}

export default App;
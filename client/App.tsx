
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './pages/PublicPage';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';

import { UserProfile } from './types';
import authService from './services/authService';

import { ToastProvider } from './context/ToastContext';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />


          {/* Public facing page (what clients see) - Uses URL param for username */}
          <Route path="/:username" element={<PublicPage />} />

          {/* Private Dashboard (what freelancer sees) */}
          <Route path="/dashboard" element={
            user ? (
              <Dashboard
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;

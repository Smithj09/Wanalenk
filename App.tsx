
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const { language } = useApp();

  const labels = {
    FR: {
      jobs: 'Module de recrutement (Intégré au tableau de bord pour les utilisateurs vérifiés)',
      market: 'Module Boutique (Bientôt disponible dans votre ville)'
    },
    KH: {
      jobs: 'Modil rekritman (Entegre nan tablo bò a pou itilizatè verifye yo)',
      market: 'Modil Boutik (Talè konsa li pral disponib nan vil ou a)'
    }
  }[language];

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
        return <AuthPage type="login" onNavigate={setCurrentPage} />;
      case 'register':
        return <AuthPage type="register" onNavigate={setCurrentPage} />;
      case 'jobs':
        return <div className="p-20 text-center font-bold text-slate-400">{labels.jobs}</div>;
      case 'marketplace':
        return <div className="p-20 text-center font-bold text-slate-400">{labels.market}</div>;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

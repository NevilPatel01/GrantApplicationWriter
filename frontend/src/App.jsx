import { useState } from 'react'
import './App.css'
import LiquidGlassDashboard from './pages/LiquidGlassDashboard'
import GrantApplicationForm from './pages/GrantApplicationForm'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleStartApplication = () => {
    setCurrentPage('application-form');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'application-form':
        return (
          <GrantApplicationForm 
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'dashboard':
      default:
        return <LiquidGlassDashboard onStartApplication={handleStartApplication} />;
    }
  };

  return (
    <div className="app w-full min-h-screen">
      {renderPage()}
    </div>
  )
}

export default App

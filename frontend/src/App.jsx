import './App.css'
import LiquidGlassDashboard from './pages/LiquidGlassDashboard'
import GrantApplicationForm from './pages/GrantApplicationForm'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LiquidGlassDashboard />} />
      <Route path="/application-form" element={<GrantApplicationForm />} />
    </Routes>
  );

}

export default App

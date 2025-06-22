import './App.css'
import LiquidGlassDashboard from './pages/LiquidGlassDashboard'
import GrantApplicationForm from './pages/GrantApplicationForm'
import ApplicationEditor from './pages/ApplicationEditor'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LiquidGlassDashboard />} />
      <Route path="/application-form" element={<GrantApplicationForm />} />
      <Route path="/application-editor" element={<ApplicationEditor />} />
    </Routes>
  );

}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Admin from './pages/Admin.jsx'
import BromaView from './pages/BromaView.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<BromaView />} />
        <Route path="/v/:id" element={<BromaView />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </StrictMode>
)

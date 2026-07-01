import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { seedDatabase } from './db/seed';
import HomePage from './pages/HomePage';
import AddPage from './pages/AddPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import ParticleBurst from './components/UI/ParticleBurst';

function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function initDb() {
      try {
        await seedDatabase();
        setDbReady(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setDbReady(true); // fall back to render to let user see interface
      }
    }
    initDb();
  }, []);

  if (!dbReady) {
    // Beautiful premium loading view
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#07090F',
          color: '#C9A55C',
          fontFamily: "'Instrument Sans', sans-serif",
          gap: '12px'
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(201, 165, 92, 0.1)',
            borderTop: '3px solid #C9A55C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <span style={{ fontSize: '12px', letterSpacing: '0.05em', color: '#6B7A99' }}>
          MONEY WEB
        </span>
        
        {/* Simple inline keyframe styles for spinning animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <>
      <ParticleBurst />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CryptoProvider } from './context/CryptoContext';
import Navbar from './components/Navbar/Navbar';
import MarketOverview from './pages/MarketOverview/MarketOverview';
import Portfolio from './pages/Portfolio/Portfolio';
import Alerts from './pages/Alerts/Alerts';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <CryptoProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<MarketOverview />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CryptoProvider>
  );
};

export default App;

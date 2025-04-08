// App.jsx (updated)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import TopCoins from "./components/portfolio/TopCoins";
import TradingSection from "./components/trading/TradingSection";
import TransferSection from "./components/transfer/TransferSection";
import { useBlockchain } from "./hooks/useBlockchain";
import { QueryProvider } from "./providers/QueryProvider";

const AppContent = () => {
  const { loading } = useBlockchain();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <QueryProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coins" element={<TopCoins />} />
              <Route path="/trading" element={<TradingSection />} />
              <Route path="/transfer" element={<TransferSection />} />
            </Routes>
          </Layout>
        </div>
    </QueryProvider>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <AppContent />
      </div>
    </Router>
  );
};

export default App;

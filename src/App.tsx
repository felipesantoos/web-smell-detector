import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analyzer } from './pages/Analyzer';
import { Catalog } from './pages/Catalog';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <Analyzer />
            </div>
          } />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
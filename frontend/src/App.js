// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import UpgradePage from './pages/UpgradePage';
import MissionsPage from './pages/MissionsPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/upgrade" element={<UpgradePage />} />
      <Route path="/missions" element={<MissionsPage />} />
    </Routes>
  </Router>
);

export default App;

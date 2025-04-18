import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Rewards from "./components/Rewards";
import DifficultySelect from "./components/DifficultySelect";
import Game from "./components/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/play" element={<DifficultySelect />} />
        <Route path="/game/:difficulty" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;

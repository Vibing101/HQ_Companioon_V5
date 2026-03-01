import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GMDashboard from "./pages/GMDashboard";
import PlayerLobby from "./pages/PlayerLobby";
import PlayerSheet from "./pages/PlayerSheet";
import HelpGuide from "./components/HelpGuide";

export default function App() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gm/:campaignId" element={<GMDashboard />} />
        <Route path="/play/:code" element={<PlayerLobby />} />
        <Route path="/hero/:heroId" element={<PlayerSheet />} />
      </Routes>

      {/* Floating help button — visible on all pages */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-hq-brown border border-hq-amber/50 text-hq-amber font-bold text-lg shadow-lg hover:bg-hq-amber hover:text-hq-dark transition-colors"
        aria-label="Open user guide"
        title="User Guide"
      >
        ?
      </button>

      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
    </div>
  );
}

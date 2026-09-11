import { useState } from "react";
import BroadcastMessaging from "./components/BroadcastMessaging";
import HotspotMap from "./components/HotspotMap";
import ManualEntryForm from "./components/ManualEntryForm";
import OfficerDashboard from "./components/OfficerDashboard";
import OfficerLogin from "./components/OfficerLogin";

const TABS = [
  { key: "map", label: "Hotspot Map" },
  { key: "dashboard", label: "Officer Dashboard" },
  { key: "manual", label: "Log Field Visit" },
  { key: "broadcast", label: "Broadcast Alert" },
];

function App() {
  const [officer, setOfficer] = useState(null);
  const [tab, setTab] = useState("map");

  if (!officer) {
    return <OfficerLogin onLoginSuccess={setOfficer} />;
  }

  function handleLogout() {
    localStorage.removeItem("agri_rakshak_token");
    setOfficer(null);
  }

  return (
    <div className="min-h-screen bg-agri-beige-50">
      <header className="bg-agri-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">Agri Rakshak</h1>
              <p className="text-xs text-agri-green-100 leading-tight">
                shurakshit phasal shurakshit jiban
              </p>
            </div>
          </div>
          <div className="text-sm flex items-center gap-3">
            <span>
              {officer.name} <span className="text-agri-green-200">· Officer</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-agri-green-800 hover:bg-agri-green-900 px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <nav className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 border-b border-agri-beige-300">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? "border-agri-green-600 text-agri-green-800"
                  : "border-transparent text-agri-green-500 hover:text-agri-green-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === "map" && <HotspotMap />}
        {tab === "dashboard" && <OfficerDashboard />}
        {tab === "manual" && <ManualEntryForm />}
        {tab === "broadcast" && <BroadcastMessaging />}
      </main>
    </div>
  );
}

export default App;

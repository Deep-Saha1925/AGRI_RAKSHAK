import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Database, Smartphone, Shield, ArrowRight, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DemoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoInspectorModal: React.FC<DemoInspectorModalProps> = ({ isOpen, onClose }) => {
  const { isMockMode, toggleMockMode } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'contract' | 'flows' | 'role'>('contract');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#d8dbd5]">
        {/* Header */}
        <div className="bg-[#004527] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#aef2c4]" />
            <div>
              <h2 className="text-base font-bold font-display">
                CropShield AI • Person 4 REST Client & API Contracts
              </h2>
              <p className="text-xs text-[#aef2c4]">
                Frontend Contract Validation & Hackathon Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#e7e9e3] bg-[#f8faf4] px-4 pt-2">
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'contract'
                ? 'border-[#004527] text-[#004527]'
                : 'border-transparent text-[#707971] hover:text-[#191c19]'
            }`}
          >
            API Endpoints & Status
          </button>
          <button
            onClick={() => setActiveTab('flows')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'flows'
                ? 'border-[#004527] text-[#004527]'
                : 'border-transparent text-[#707971] hover:text-[#191c19]'
            }`}
          >
            Fast Demo Flows
          </button>
          <button
            onClick={() => setActiveTab('role')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'role'
                ? 'border-[#004527] text-[#004527]'
                : 'border-transparent text-[#707971] hover:text-[#191c19]'
            }`}
          >
            Person 4 Role Boundaries
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'contract' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f4ee] border border-[#d8dbd5]">
                <div>
                  <span className="font-bold text-[#191c19] block">
                    Mode: {isMockMode ? 'VITE_MOCK_MODE=true' : 'Live REST Backend'}
                  </span>
                  <span className="text-[#707971] text-[11px]">
                    {isMockMode
                      ? 'Self-contained offline client. Works without running backend.'
                      : 'Connecting to http://localhost:8000/api'}
                  </span>
                </div>
                <button
                  onClick={toggleMockMode}
                  className="px-3 py-1.5 rounded-lg bg-[#004527] text-white font-bold hover:bg-[#1b5e3b] transition-colors"
                >
                  Switch to {isMockMode ? 'Live API' : 'Mock Mode'}
                </button>
              </div>

              <div className="border border-[#e7e9e3] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8faf4] border-b border-[#e7e9e3] text-[#404942]">
                    <tr>
                      <th className="p-2.5 font-bold">Method & Endpoint</th>
                      <th className="p-2.5 font-bold">Purpose</th>
                      <th className="p-2.5 font-bold">Person 4 Contract</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e9e3]">
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">POST /auth/register/</td>
                      <td className="p-2.5">Farmer sign-up</td>
                      <td className="p-2.5 text-emerald-700">Hardcodes role: "farmer"</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">POST /auth/login/</td>
                      <td className="p-2.5">JWT token exchange</td>
                      <td className="p-2.5 text-emerald-700">Returns access, refresh</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">POST /fields/</td>
                      <td className="p-2.5">Field registration</td>
                      <td className="p-2.5 text-amber-700">
                        Isolated in <code className="bg-gray-100 px-1 rounded">formatFieldPayload()</code> for Person 3
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">GET /risk/{'{field_id}'}/latest/</td>
                      <td className="p-2.5">Field risk & irrigation</td>
                      <td className="p-2.5 text-emerald-700">Person 4 never calls weather API</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">POST /diagnosis/</td>
                      <td className="p-2.5">Multipart image diagnosis</td>
                      <td className="p-2.5 text-emerald-700">Routes: &gt;=0.90 farmer, &lt;0.90 officer</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">GET /advisory/{'{disease}'}/</td>
                      <td className="p-2.5">4-step IPM advisory</td>
                      <td className="p-2.5 text-emerald-700">REMOVE → PROTECT → MONITOR → ESCALATE</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">POST /advisory/recheck/</td>
                      <td className="p-2.5">Schedule recovery recheck</td>
                      <td className="p-2.5 text-emerald-700">Sends diagnosis_id & scheduled_for</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#1b5e3b]">GET /alerts/ & POST read</td>
                      <td className="p-2.5">Farmer notification stream</td>
                      <td className="p-2.5 text-emerald-700">High risk, diagnosis ready, triage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="space-y-3">
              <p className="text-[#404942]">
                Test the two core hackathon judge validation flows immediately:
              </p>

              {/* Flow A */}
              <div className="p-3.5 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      FLOW A
                    </span>
                    <h3 className="font-bold text-[#004527]">High-Confidence Flow (91%)</h3>
                  </div>
                  <p className="text-[#404942] mt-1">
                    Upload leaf photo → Confidence = 91% (&gt;= 90%) → Routed to Farmer → Show Early Blight &amp; IPM
                    Advisory + Voice narration.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/scan?demo=high');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Flow B */}
              <div className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      FLOW B
                    </span>
                    <h3 className="font-bold text-amber-950">Low-Confidence Flow (62%)</h3>
                  </div>
                  <p className="text-[#404942] mt-1">
                    Upload leaf photo → Confidence = 62% (&lt; 90%) → Routed to Officer Queue → UI safely shows "Needs
                    expert review" (never presents uncertain AI as final).
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/scan?demo=low');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold hover:bg-amber-800 transition-colors flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'role' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-1">Person 4 Strict Role Ownership</h3>
                <ul className="list-disc pl-4 space-y-1 text-blue-800">
                  <li>Farmer authentication UI (Register/Login with JWT storage)</li>
                  <li>Farmer Dashboard &amp; My Fields management</li>
                  <li>Isolated POST /fields/ request payload formatter</li>
                  <li>Camera/Crop photo capture &amp; Image Quality Pre-check</li>
                  <li>Confidence Routing enforcement (≥90% vs &lt;90%)</li>
                  <li>4-Step non-commercial IPM advisory presentation</li>
                  <li>Follow-up scheduling and recheck outcome logging</li>
                  <li>Voice Input (SpeechRecognition) &amp; Voice Output (SpeechSynthesis)</li>
                  <li>Marathi, Hindi, English trilingual localization</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700">
                <h4 className="font-bold mb-1">What Person 4 DOES NOT Do:</h4>
                <p>
                  No weather API calls (owned by Person 2), no backend database or models (Person 1 &amp; 3), no
                  officer dashboard (Person 5), and no advisory CMS (Person 6).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8faf4] border-t border-[#e7e9e3] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#004527] text-white font-semibold text-xs hover:bg-[#1b5e3b] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

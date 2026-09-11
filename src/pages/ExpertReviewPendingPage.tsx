import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getDiagnosisById } from '../api/diagnosis';
import { DiagnosisResult } from '../types';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

export const ExpertReviewPendingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      try {
        const data = await getDiagnosisById(id);
        setDiagnosis(data);
      } catch (err) {
        console.error('Failed to load pending diagnosis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    setStatusMessage(null);
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusMessage(
        language === 'mr'
          ? 'कृषी अधिकारी (तालुका कृषी अधिकारी अकोला) कडून पुनरावलोकन सुरू आहे. साधारण २४ तासांत संदेश येईल.'
          : 'Case is currently under active review by Block Agriculture Officer (Akola). Estimated response: within 24 hours.'
      );
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf4] flex items-center justify-center p-4">
        <div className="text-center text-sm text-[#707971]">
          {language === 'mr' ? 'तपशील लोड होत आहेत...' : 'Loading case details...'}
        </div>
      </div>
    );
  }

  const confidencePct = diagnosis ? Math.round(diagnosis.confidence * 100) : 62;

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-xl mx-auto space-y-4">
      {/* Top back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.home}</span>
        </button>

        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Case #{diagnosis?.diagnosis_id || id}
        </span>
      </div>

      {/* Main Alert Card: Needs Expert Review */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Safe Non-Definitive Title */}
        <h1 className="text-2xl font-bold font-display text-amber-950">
          {t.needsExpertReview}
        </h1>

        {/* Confidence pill strictly highlighting low certainty */}
        <div className="inline-flex items-baseline gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full mt-2">
          <span className="text-xs text-amber-900 font-semibold">{t.confidence}:</span>
          <span className="text-sm font-black text-amber-800 font-display">
            {confidencePct}%
          </span>
          <span className="text-[11px] text-amber-700 font-medium">(&lt; 90% threshold)</span>
        </div>

        {/* Explain why AI is not diagnosing */}
        <p className="text-xs sm:text-sm text-[#404942] mt-4 leading-relaxed max-w-md mx-auto">
          {t.lowConfidenceNote}
        </p>

        {/* Reassurance */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#eef7f0] border border-[#aef2c4] text-xs font-medium text-[#004527] flex items-center justify-center gap-2">
          <UserCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
          <span>{t.caseSentToOfficer}</span>
        </div>
      </div>

      {/* Case Metadata Sheet */}
      <div className="bg-white rounded-2xl p-5 border border-[#e7e9e3] shadow-xs space-y-3 text-xs">
        <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider">
          {language === 'mr' ? 'तपासणी केस तपशील' : 'Case & Review Details'}
        </h2>

        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-[#707971]">{t.caseId}:</span>
          <span className="font-mono font-bold text-[#191c19]">CS-TRIAGE-{diagnosis?.diagnosis_id || id}</span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-[#707971]">{t.submittedTime}:</span>
          <span className="font-semibold text-[#191c19]">
            {diagnosis?.created_at ? new Date(diagnosis.created_at).toLocaleString() : 'Just now'}
          </span>
        </div>

        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-[#707971]">{t.fields}:</span>
          <span className="font-semibold text-[#191c19]">Field #{diagnosis?.field_id || 1} (Soybean)</span>
        </div>

        <div className="flex justify-between py-1.5">
          <span className="text-[#707971]">Reviewing Authority:</span>
          <span className="font-semibold text-[#004527]">Sub-Divisional Agri Officer, Akola</span>
        </div>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed animate-fadeIn">
          {statusMessage}
        </div>
      )}

      {/* Check Review Status CTA */}
      <div className="space-y-2.5">
        <button
          id="btn-check-review-status"
          onClick={handleCheckStatus}
          disabled={checkingStatus}
          className="w-full py-3.5 px-4 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${checkingStatus ? 'animate-spin' : ''}`} />
          <span>{checkingStatus ? 'Checking...' : t.checkReviewStatus}</span>
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 px-4 rounded-xl bg-white border border-[#d8dbd5] text-[#404942] font-semibold text-xs hover:bg-[#f2f4ee]"
        >
          {t.home}
        </button>
      </div>

      {/* Kisan Call Center Helpline */}
      <div className="p-3 bg-[#edefe9] rounded-xl text-center text-xs text-[#404942]">
        <div className="flex items-center justify-center gap-1.5 font-bold text-[#004527]">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Kisan Call Center: 1800-180-1551 (Toll-free)</span>
        </div>
      </div>
    </div>
  );
};

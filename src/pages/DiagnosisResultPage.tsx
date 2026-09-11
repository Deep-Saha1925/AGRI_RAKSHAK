import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { getDiagnosisById } from '../api/diagnosis';
import { getAdvisoryByDisease } from '../api/advisory';
import { DiagnosisResult, AdvisoryData } from '../types';
import {
  Sprout,
  CheckCircle2,
  Volume2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const DiagnosisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { speakAdvisory, speakText } = useVoice();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [advisory, setAdvisory] = useState<AdvisoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const diagData = await getDiagnosisById(id);
        setDiagnosis(diagData);

        // Fetch 4-step IPM advisory
        if (diagData.disease) {
          const advData = await getAdvisoryByDisease(diagData.disease);
          setAdvisory(advData);
        }
      } catch (err) {
        console.error('Failed to load diagnosis result', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf4] flex items-center justify-center p-4">
        <div className="text-center text-sm text-[#707971]">
          {language === 'mr' ? 'निदान अहवाल लोड होत आहे...' : 'Loading diagnosis result...'}
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-[#f8faf4] p-4 text-center pt-16">
        <h2 className="text-lg font-bold text-[#191c19]">Diagnosis not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 rounded-xl bg-[#004527] text-white font-bold text-xs"
        >
          {t.home}
        </button>
      </div>
    );
  }

  const confidencePct = Math.round(diagnosis.confidence * 100);

  const handleHearAdvisory = () => {
    if (!advisory) return;
    speakAdvisory({
      disease: diagnosis.disease,
      steps: advisory.steps,
      escalate: advisory.escalate_if,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-2xl mx-auto space-y-5">
      {/* Top Banner: Disease Detected */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#16a34a] shadow-xs relative overflow-hidden">
        {/* Subtle decorative leaf accent */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping"></span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#166534]">
            🌱 {t.diseaseDetected}
          </span>
          <span className="text-xs text-[#707971] ml-auto font-mono">
            ID: #{diagnosis.diagnosis_id}
          </span>
        </div>

        {/* Disease Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#004527]">
          {diagnosis.disease}
        </h1>

        {/* Confidence & Status Pill */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-baseline gap-1.5 bg-[#eef7f0] px-3 py-1.5 rounded-xl border border-[#aef2c4]">
            <span className="text-xs text-[#404942] font-semibold">{t.confidence}:</span>
            <span className="text-lg font-black text-[#166534] font-display">
              {confidencePct}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f2f4ee] px-3 py-1.5 rounded-xl text-xs font-bold text-[#004527] border border-[#d8dbd5]">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            <span>{t.aiDiagnosed}</span>
          </div>

          <span className="text-xs text-[#707971]">
            Field #{diagnosis.field_id} • {new Date(diagnosis.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="mt-4 pt-3 border-t border-[#f2f4ee] flex items-start gap-2 text-xs text-[#404942]">
          <Info className="w-4 h-4 text-[#707971] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-[#191c19]">Notice: </strong>
            {t.aiDisclaimer}
          </p>
        </div>
      </div>

      {/* 4-Step IPM Advisory Section */}
      {advisory && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e7e9e3] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#004527]">
                {t.whatShouldIDo}
              </h2>
              <p className="text-xs text-[#707971]">
                {language === 'mr'
                  ? 'एकात्मिक कीड व्यवस्थापन (IPM) मार्गदर्शक कृती'
                  : 'Integrated Pest Management (IPM) 4-Step Treatment'}
              </p>
            </div>

            {/* Hear Advisory Button */}
            <button
              id="btn-hear-advisory"
              onClick={handleHearAdvisory}
              className="px-3.5 py-2 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-xs shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#aef2c4]" />
              <span>{t.hearAdvisory}</span>
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {advisory.steps.map((step) => (
              <div
                key={step.step_number}
                className="p-4 rounded-2xl bg-[#f8faf4] border border-[#e7e9e3] flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#004527] text-white font-black text-sm flex items-center justify-center shrink-0">
                  {step.step_number}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#191c19]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#404942] mt-1 leading-normal">
                    {step.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Escalate If Condition Box */}
          <div className="p-4 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#9a3412] uppercase tracking-wider block">
                {t.escalateIf}:
              </span>
              <p className="text-xs text-[#7c2d12] mt-0.5 font-medium leading-normal">
                {advisory.escalate_if}
              </p>
            </div>
          </div>

          {/* Primary Next Action: Schedule Follow-up */}
          <div className="pt-2">
            <button
              id="btn-schedule-followup-cta"
              onClick={() => navigate(`/followup?diagnosisId=${diagnosis.diagnosis_id}&fieldId=${diagnosis.field_id}`)}
              className="w-full py-4 px-5 rounded-2xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#2e7d53]"
            >
              <Calendar className="w-5 h-5 text-[#aef2c4]" />
              <span>{t.scheduleFollowUp}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

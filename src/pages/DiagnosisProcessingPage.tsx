import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { createDiagnosis } from '../api/diagnosis';
import { Sprout, ShieldCheck, Loader2, Sparkles, Cpu } from 'lucide-react';

export const DiagnosisProcessingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    t.analyzingCrop,
    t.checkingSymptoms,
    language === 'mr' ? 'कीड व रोगाचा नमुना जुळवत आहे...' : 'Matching with Maharashtra crop disease dataset...',
    t.pleaseWait,
  ];

  useEffect(() => {
    // Step text ticker
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 600);

    const runAnalysis = async () => {
      const pendingImage = sessionStorage.getItem('cropshield_pending_image');
      const pendingFieldId = sessionStorage.getItem('cropshield_pending_field_id') || '1';
      const scenario = sessionStorage.getItem('cropshield_pending_scenario') as 'high' | 'low' | undefined;

      if (!pendingImage) {
        navigate('/scan');
        return;
      }

      try {
        // Small realistic pause so the radar scanner animation can be seen (1.2s)
        await new Promise((resolve) => setTimeout(resolve, 1300));

        // Call Person 4 REST Client: POST /diagnosis/
        const result = await createDiagnosis({
          field_id: Number(pendingFieldId),
          image: pendingImage,
          scenario: scenario || 'high',
        });

        // Strict Confidence Routing Mandate
        // "If confidence >= 0.90: Show disease detected"
        // "If confidence < 0.90: CropShield could not identify with enough confidence. Sent to officer."
        if (result.confidence >= 0.90 && result.routed_to === 'farmer') {
          navigate(`/diagnosis/${result.diagnosis_id}`);
        } else {
          navigate(`/diagnosis/${result.diagnosis_id}/pending`);
        }
      } catch (err: any) {
        setError(err?.message || 'Diagnosis service unavailable. Please retry.');
      }
    };

    runAnalysis();

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-[#f8faf4]">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-[#e7e9e3] shadow-md text-center flex flex-col items-center">
        {/* Animated Radar Scanning Effect */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
          <div className="absolute inset-3 rounded-full border border-emerald-500/30"></div>
          <div className="absolute inset-6 rounded-full border border-emerald-500/40"></div>

          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-tr from-emerald-500/30 to-transparent animate-spin origin-center duration-1000"></div>
          </div>

          {/* Central Leaf Icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#004527] text-white flex items-center justify-center shadow-lg">
            <Sprout className="w-9 h-9 text-[#aef2c4] animate-bounce duration-1000" />
          </div>
        </div>

        {/* Status Text Ticker */}
        <div className="min-h-[64px] flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold font-display text-[#004527] transition-all">
            {steps[stepIndex]}
          </h2>
          <p className="text-xs text-[#707971] mt-1 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#1b5e3b]" />
            <span>AI Neural Vision Model</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#f2f4ee] h-2 rounded-full mt-6 overflow-hidden border border-[#d8dbd5]">
          <div className="h-full bg-[#1b5e3b] rounded-full animate-pulse w-3/4"></div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
            <button
              onClick={() => navigate('/scan')}
              className="mt-2 block w-full py-1.5 bg-red-600 text-white rounded font-bold"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#f2f4ee] text-[11px] text-[#707971]">
          <span>Person 4 Client → POST /diagnosis/</span>
        </div>
      </div>
    </div>
  );
};

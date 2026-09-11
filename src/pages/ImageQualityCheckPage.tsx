import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Sun,
  Maximize2,
  Hand,
  Sliders,
} from 'lucide-react';

export const ImageQualityCheckPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fieldId, setFieldId] = useState<string>('1');
  const [isWarningSimulated, setIsWarningSimulated] = useState<boolean>(false);
  const [isQualityGood, setIsQualityGood] = useState<boolean>(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('cropshield_pending_image');
    const storedFieldId = sessionStorage.getItem('cropshield_pending_field_id') || '1';
    if (!stored) {
      navigate('/scan');
      return;
    }
    setImageUrl(stored);
    setFieldId(storedFieldId);
  }, [navigate]);

  const handleRetake = () => {
    sessionStorage.removeItem('cropshield_pending_image');
    navigate('/scan');
  };

  const handleProceed = () => {
    navigate('/scan/processing');
  };

  if (!imageUrl) return null;

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-xl mx-auto space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-display text-[#004527]">
          {t.qualityCheckTitle}
        </h1>
        <p className="text-xs text-[#707971] mt-0.5">
          {language === 'mr'
            ? 'अचूक रोगाचे विश्लेषण करण्यासाठी फोटोची गुणवत्ता तपासा'
            : 'Verifying sharpness, lighting, and leaf centering'}
        </p>
      </div>

      {/* Image Preview Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#d8dbd5] bg-black shadow-md aspect-4/3 max-h-[380px] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Captured Crop Leaf"
          className={`w-full h-full object-cover transition-all ${
            isWarningSimulated ? 'blur-xs contrast-75 brightness-75' : ''
          }`}
        />

        {/* Framing Guide Lines */}
        <div className="absolute inset-6 border-2 border-white/60 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
          <span className="bg-black/50 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
            {language === 'mr' ? 'पानाचा भाग' : 'Target Leaf Zone'}
          </span>
        </div>

        {/* Quality status badge */}
        <div className="absolute top-3 right-3">
          {isWarningSimulated ? (
            <span className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Needs Check</span>
            </span>
          ) : (
            <span className="bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Good Quality</span>
            </span>
          )}
        </div>
      </div>

      {/* Simulation Toggle for Judges */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#edefe9] border border-[#d8dbd5] text-xs">
        <span className="text-[#404942] font-semibold flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#1b5e3b]" />
          <span>Demo: Simulate Image Clarity Check</span>
        </span>
        <button
          id="btn-toggle-clarity-sim"
          onClick={() => setIsWarningSimulated(!isWarningSimulated)}
          className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-[#d8dbd5] text-[#004527] hover:bg-gray-50"
        >
          {isWarningSimulated ? 'Switch to Clear' : 'Simulate Unclear'}
        </button>
      </div>

      {/* Warning Alert if photo appears unclear */}
      {isWarningSimulated ? (
        <div className="p-4 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#9a3412] font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-[#ea580c]" />
            <span>{t.photoUnclearWarning}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <Hand className="w-4 h-4 mx-auto text-amber-700 mb-1" />
              <span className="text-amber-950 font-medium leading-tight block">
                {t.holdSteady}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <Maximize2 className="w-4 h-4 mx-auto text-amber-700 mb-1" />
              <span className="text-amber-950 font-medium leading-tight block">
                {t.moveCloser}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
              <Sun className="w-4 h-4 mx-auto text-amber-700 mb-1" />
              <span className="text-amber-950 font-medium leading-tight block">
                {t.addMoreLight}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              id="btn-retake-unclear"
              onClick={handleRetake}
              className="w-1/2 py-3 px-4 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-50 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.retakePhoto}</span>
            </button>
            <button
              id="btn-use-photo-anyway"
              onClick={handleProceed}
              className="w-1/2 py-3 px-4 rounded-xl bg-[#ea580c] text-white font-bold text-xs hover:bg-[#c2410c] shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>{t.useThisPhoto}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Acceptable Photo Flow */
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#eef7f0] border border-[#aef2c4] text-xs text-[#004527] flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-[#16a34a] shrink-0" />
            <span>
              {language === 'mr'
                ? 'पानाची गुणवत्ता स्पष्ट व योग्य आहे. एआय तपासणी सुरू करण्यासाठी खालील बटण दाबा.'
                : 'Leaf lighting and resolution are optimal for AI model analysis.'}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              id="btn-retake-clear"
              onClick={handleRetake}
              className="w-1/3 py-3.5 px-4 rounded-xl bg-white border border-[#d8dbd5] text-[#707971] font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.retakePhoto}</span>
            </button>
            <button
              id="btn-analyze-crop-submit"
              onClick={handleProceed}
              className="w-2/3 py-3.5 px-4 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#aef2c4]" />
              <span>{t.analyzeCrop}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

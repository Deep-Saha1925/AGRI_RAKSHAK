import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { getAdvisoryByDisease } from '../api/advisory';
import { AdvisoryData } from '../types';
import {
  Volume2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Sprout,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

const COMMON_DISEASES = [
  'Early Blight',
  'Late Blight',
  'Cotton Leaf Curl',
  'Soybean Rust',
  'Anthracnose',
];

export const AdvisoryPage: React.FC = () => {
  const { disease: diseaseParam } = useParams<{ disease: string }>();
  const { t, language } = useLanguage();
  const { speakAdvisory } = useVoice();
  const navigate = useNavigate();

  const [selectedDisease, setSelectedDisease] = useState<string>(
    diseaseParam || 'Early Blight'
  );
  const [advisory, setAdvisory] = useState<AdvisoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisory = async () => {
      setLoading(true);
      try {
        const data = await getAdvisoryByDisease(selectedDisease);
        setAdvisory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisory();
  }, [selectedDisease]);

  const handleHear = () => {
    if (!advisory) return;
    speakAdvisory({
      disease: selectedDisease,
      steps: advisory.steps,
      escalate: advisory.escalate_if,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-2xl mx-auto space-y-5">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <span className="text-xs font-bold text-[#1b5e3b] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          IPM Advisory System
        </span>
      </div>

      {/* Disease selector pills */}
      <div>
        <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-2">
          {language === 'mr' ? 'रोग निवडा (Explore Crop Advisories)' : 'Explore Crop Disease Advisories'}
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_DISEASES.map((dis) => (
            <button
              key={dis}
              onClick={() => setSelectedDisease(dis)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDisease === dis
                  ? 'bg-[#004527] text-white shadow-xs'
                  : 'bg-white text-[#404942] border border-[#d8dbd5] hover:bg-gray-50'
              }`}
            >
              {dis}
            </button>
          ))}
        </div>
      </div>

      {/* Main Advisory Card */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#707971]">
          Loading advisory details...
        </div>
      ) : advisory ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e7e9e3] shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534] bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                {language === 'mr' ? 'प्रमाणित सल्ला' : 'Standard IPM Protocol'}
              </span>
              <h1 className="text-2xl font-bold font-display text-[#004527]">
                {advisory.disease}
              </h1>
              <p className="text-xs text-[#707971] mt-0.5">
                {language === 'mr'
                  ? 'महात्मा फुले कृषी विद्यापीठ शिफारशीनुसार कृती आराखडा'
                  : 'Scientific University IPM recommendations (Non-commercial)'}
              </p>
            </div>

            <button
              id="btn-hear-advisory-page"
              onClick={handleHear}
              className="px-3.5 py-2 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4 text-[#aef2c4]" />
              <span>{t.hearAdvisory}</span>
            </button>
          </div>

          {/* 4 Action Steps */}
          <div className="space-y-3 pt-2">
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

          {/* Escalate If */}
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

          {/* Schedule Followup CTA */}
          <div className="pt-2">
            <button
              onClick={() => navigate(`/followup?disease=${encodeURIComponent(advisory.disease)}`)}
              className="w-full py-4 px-5 rounded-2xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-[#aef2c4]" />
              <span>{t.scheduleFollowUp}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

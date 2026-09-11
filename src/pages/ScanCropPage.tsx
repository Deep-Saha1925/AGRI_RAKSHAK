import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';

// Representative agricultural test samples for effortless hackathon demonstration
const SAMPLE_TEST_IMAGES = [
  {
    id: 'sample-high',
    name: 'Cotton Early Blight (High 91%)',
    disease: 'Early Blight',
    fieldId: 1,
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
    type: 'high',
    desc: 'Distinct circular brown concentric spots on cotton leaf',
  },
  {
    id: 'sample-low',
    name: 'Soybean Mixed Lesion (Low 62%)',
    disease: 'Unknown Leaf Spot',
    fieldId: 2,
    url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    type: 'low',
    desc: 'Unclear lesion on soybean leaf requiring officer triage',
  },
];

export const ScanCropPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fieldIdParam = searchParams.get('fieldId') || '1';
  const demoParam = searchParams.get('demo'); // 'high' or 'low'

  const [selectedFieldId, setSelectedFieldId] = useState<number>(Number(fieldIdParam) || 1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, forceScenario?: 'high' | 'low') => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      sessionStorage.setItem('cropshield_pending_image', dataUrl);
      sessionStorage.setItem('cropshield_pending_field_id', String(selectedFieldId));
      if (forceScenario) {
        sessionStorage.setItem('cropshield_pending_scenario', forceScenario);
      } else if (demoParam) {
        sessionStorage.setItem('cropshield_pending_scenario', demoParam);
      }
      navigate('/scan/quality-check');
    };
    reader.readAsDataURL(file);
  };

  const handlePickSample = (sample: typeof SAMPLE_TEST_IMAGES[0]) => {
    sessionStorage.setItem('cropshield_pending_image', sample.url);
    sessionStorage.setItem('cropshield_pending_field_id', String(sample.fieldId));
    sessionStorage.setItem('cropshield_pending_scenario', sample.type);
    navigate('/scan/quality-check');
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>
        <span className="text-xs font-bold text-[#004527] bg-[#eef7f0] px-2.5 py-1 rounded-full border border-[#aef2c4]">
          {language === 'mr' ? 'पीक आरोग्य स्कॅनर' : 'Crop Health Scanner'}
        </span>
      </div>

      {/* Hero explanation */}
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#004527] to-[#1b5e3b] text-white flex items-center justify-center mx-auto shadow-md mb-3">
          <Camera className="w-9 h-9 text-[#aef2c4]" />
        </div>
        <h1 className="text-2xl font-bold font-display text-[#004527]">
          {t.scanYourCrop}
        </h1>
        <p className="text-sm text-[#404942] max-w-md mx-auto mt-1 leading-normal">
          {t.takeClearPhotoPrompt}
        </p>
      </div>

      {/* Target Field Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#e7e9e3] shadow-xs">
        <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5">
          {language === 'mr' ? 'तपासणीसाठी शेत निवडा' : 'Select Target Field for Scan'}
        </label>
        <select
          id="select-scan-field"
          value={selectedFieldId}
          onChange={(e) => setSelectedFieldId(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] text-sm font-semibold text-[#191c19] bg-white focus:ring-2 focus:ring-[#1b5e3b] focus:outline-none"
        >
          <option value={1}>Field 1: Cotton (कापूस) — Akola, Vidarbha</option>
          <option value={2}>Field 2: Soybean (सोयाबीन) — Latur, Marathwada</option>
          <option value={3}>Field 3: Pigeonpea Tur (तूर) — Chandrapur</option>
        </select>
      </div>

      {/* Capture Actions (54px+ tap targets) */}
      <div className="space-y-3">
        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />

        {/* Take Photo Button */}
        <button
          id="btn-take-photo-camera"
          onClick={() => cameraInputRef.current?.click()}
          className="w-full py-4 px-5 rounded-2xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer border border-[#2e7d53]"
        >
          <Camera className="w-6 h-6 text-[#aef2c4]" />
          <span>{t.takePhoto}</span>
        </button>

        {/* Gallery Upload Button */}
        <button
          id="btn-choose-gallery"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-[#f2f4ee] text-[#004527] font-bold text-base shadow-xs active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer border border-[#d8dbd5]"
        >
          <Upload className="w-5 h-5 text-[#1b5e3b]" />
          <span>{t.chooseFromGallery}</span>
        </button>
      </div>

      {/* Quick Test Samples (Essential for instant testing without leaves) */}
      <div className="bg-[#f2f4ee] rounded-2xl p-4 border border-[#d8dbd5]">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#1b5e3b]" />
          <h2 className="text-xs font-bold text-[#004527] uppercase tracking-wider">
            {language === 'mr' ? 'चाचणीसाठी नमुना पाने (Demo Samples)' : 'Demo Test Leaves (One-Tap Validation)'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_TEST_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handlePickSample(sample)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#d8dbd5] hover:border-[#1b5e3b] hover:shadow-sm text-left transition-all cursor-pointer group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-12 h-12 rounded-lg object-cover border border-black/10 shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#191c19] block truncate group-hover:text-[#004527]">
                  {sample.name}
                </span>
                <span className="text-[10px] text-[#707971] block truncate">
                  {sample.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Simple Photography Instructions (Low-Literacy Friendly) */}
      <div className="bg-white rounded-2xl p-5 border border-[#e7e9e3] shadow-xs">
        <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider mb-3">
          {language === 'mr' ? 'फोटो काढण्यासाठी सोप्या टिप्स' : 'Photography Guidelines for Accurate AI'}
        </h2>
        <ul className="space-y-2.5 text-xs text-[#191c19]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
            <span>{t.instruction1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
            <span>{t.instruction2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
            <span>{t.instruction3}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
            <span>{t.instruction4}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

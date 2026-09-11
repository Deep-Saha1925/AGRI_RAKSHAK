import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Volume2,
  LogOut,
  Shield,
  Check,
  Smartphone,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

export const ProfilePage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, isMockMode, toggleMockMode } = useAuth();
  const { speakText } = useVoice();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (lang === 'mr') {
      speakText('भाषा मराठी म्हणून निवडली आहे.');
    } else if (lang === 'hi') {
      speakText('भाषा हिंदी चुनी गई है।');
    } else {
      speakText('Language switched to English.');
    }
  };

  const handleTestVoice = () => {
    if (language === 'mr') {
      speakText('नमस्कार शेतकरी बंधूंनो! क्रॉपशील्ड एआय आपल्या पिकांच्या संरक्षणासाठी सज्ज आहे.');
    } else if (language === 'hi') {
      speakText('नमस्ते किसान भाइयों! क्रॉपशील्ड एआई आपकी फसलों की सुरक्षा के लिए तैयार है।');
    } else {
      speakText('Hello Farmer! CropShield AI voice assistance is active and ready.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-xl mx-auto space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e7e9e3] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#004527] text-white flex items-center justify-center font-bold text-2xl font-display shadow-sm">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-[#191c19]">
              {user?.name || 'Rajesh Patil'}
            </h1>
            <p className="text-xs text-[#707971] flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-[#1b5e3b]" />
              <span>+91 {user?.phone || '9876543210'}</span>
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#eef7f0] text-[#1b5e3b] font-bold text-[11px] border border-[#aef2c4]">
                Role: {user?.role || 'farmer'}
              </span>
              <span className="text-[11px] text-[#707971] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1b5e3b]" />
                {user?.district || 'Akola, Vidarbha'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preferences Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e7e9e3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#1b5e3b]" />
            <h2 className="text-sm font-bold text-[#191c19]">
              {t.preferredLanguage}
            </h2>
          </div>
          <button
            onClick={handleTestVoice}
            className="flex items-center gap-1 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] bg-[#f2f4ee] px-2.5 py-1 rounded-lg cursor-pointer"
            title="Test voice synthesizer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice</span>
          </button>
        </div>

        {/* <p className="text-xs text-[#707971]">
          {language === 'mr' || language === 'hi'
            ? 'आपल्या आवडीची भाषा निवडा. सर्व स्क्रीन व आवाज या भाषेत बदलतील.'
            : 'Select your regional dialect for screens, voice prompts, and IPM advisories.'}
        </p> */}

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            id="profile-lang-mr"
            onClick={() => handleLanguageChange('mr')}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              language === 'mr'
                ? 'bg-[#004527] text-white border-[#004527] shadow-sm'
                : 'bg-[#f8faf4] text-[#404942] border-[#d8dbd5] hover:bg-[#edefe9]'
            }`}
          >
            <span className="text-sm font-bold">मराठी</span>
            <span className="text-[10px] opacity-80">Marathi</span>
          </button>

          <button
            type="button"
            id="profile-lang-hi"
            onClick={() => handleLanguageChange('hi')}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              language === 'hi'
                ? 'bg-[#004527] text-white border-[#004527] shadow-sm'
                : 'bg-[#f8faf4] text-[#404942] border-[#d8dbd5] hover:bg-[#edefe9]'
            }`}
          >
            <span className="text-sm font-bold">हिन्दी</span>
            <span className="text-[10px] opacity-80">Hindi</span>
          </button>

          <button
            type="button"
            id="profile-lang-en"
            onClick={() => handleLanguageChange('en')}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              language === 'en'
                ? 'bg-[#004527] text-white border-[#004527] shadow-sm'
                : 'bg-[#f8faf4] text-[#404942] border-[#d8dbd5] hover:bg-[#edefe9]'
            }`}
          >
            <span className="text-sm font-bold">English</span>
            <span className="text-[10px] opacity-80">English</span>
          </button>
        </div>
      </div>

      {/* Demo & Architecture Settings */}
      <div className="bg-white rounded-3xl p-6 border border-[#e7e9e3] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#1b5e3b]" />
          <h2 className="text-sm font-bold text-[#191c19]">
            Hackathon &amp; API Settings
          </h2>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f4ee] border border-[#d8dbd5]">
          <div>
            <span className="text-xs font-bold text-[#191c19] block">
              Mock Mode (Offline Demonstration)
            </span>
            <span className="text-[11px] text-[#707971]">
              {isMockMode ? 'Active (VITE_MOCK_MODE=true)' : 'Live REST Backend (localhost:8000)'}
            </span>
          </div>
          <button
            onClick={toggleMockMode}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#004527] text-white hover:bg-[#1b5e3b] transition-colors"
          >
            Toggle
          </button>
        </div>

        {/* <div className="text-[11px] text-[#707971] space-y-1">
          <p>• Person 4: Farmer Application UI Only</p>
          <p>• Weather API: Delegated to Person 2 Backend</p>
          <p>• POST /fields/ payload hook: <code>formatFieldPayload</code></p>
        </div> */}
      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-700 font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Government of Maharashtra Footer Endorsement */}
      <div className="text-center pt-4 text-[11px] text-[#707971] space-y-0.5">
        <p className="font-semibold text-[#404942]">CropShield AI • Government of Maharashtra</p>
        <p>Maharashtra State Innovation Society (MSIS)</p>
      </div>
    </div>
  );
};

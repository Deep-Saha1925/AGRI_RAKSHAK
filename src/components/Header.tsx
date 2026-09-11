import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { Mic, MicOff, Volume2, VolumeX, ShieldCheck, PhoneCall, Code, Layers } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onOpenInspector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInspector }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isMockMode, toggleMockMode } = useAuth();
  const { isListening, isSpeaking, startListening, stopListening, stopSpeaking, voiceFeedback } =
    useVoice();
  const navigate = useNavigate();

  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e7e9e3] shadow-xs">
      {/* Top Civic & Role Identifier Banner */}
      <div className="bg-[#004527] text-white text-xs px-3 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        </div>

        {/* Demo Fast-Action bar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            id="btn-flow-a-quick"
            onClick={() => navigate('/scan?demo=high')}
            className="text-[11px] bg-[#1b5e3b] hover:bg-[#25784c] text-white px-2 py-0.5 rounded border border-[#2e7d53] transition-colors cursor-pointer flex items-center gap-1"
            title="Fast Demo: High Confidence (91%)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
            <span>Flow A: 91%</span>
          </button>

          <button
            id="btn-flow-b-quick"
            onClick={() => navigate('/scan?demo=low')}
            className="text-[11px] bg-[#1b5e3b] hover:bg-[#25784c] text-white px-2 py-0.5 rounded border border-[#2e7d53] transition-colors cursor-pointer flex items-center gap-1"
            title="Fast Demo: Low Confidence Triage (62%)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></span>
            <span>Flow B: 62%</span>
          </button>

          {onOpenInspector && (
            <button
              id="btn-open-api-contracts"
              onClick={onOpenInspector}
              className="text-[11px] bg-[#2b4c7e] hover:bg-[#39629e] text-white px-2 py-0.5 rounded border border-[#4470b0] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Code className="w-3 h-3" />
              <span className="hidden md:inline">API Contracts</span>
            </button>
          )}
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Civic Branding */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b5e3b] to-[#004527] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-[#aef2c4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg sm:text-xl text-[#004527] tracking-tight font-display">
                CropShield AI
              </span>
              <span className="text-[10px] bg-[#f2f4ee] border border-[#d8dbd5] text-[#1b5e3b] font-bold px-1.5 py-0.2 rounded">
                शासन
              </span>
            </div>
            <p className="text-[11px] text-[#404942] font-medium hidden xs:block">
              {language === 'mr'
                ? 'महाराष्ट्र शासन • कृषी विभाग'
                : language === 'hi'
                ? 'महाराष्ट्र शासन • कृषि विभाग'
                : 'Govt of Maharashtra • Agri Dept'}
            </p>
          </div>
        </Link>

        {/* Action Controls: Language, Voice, Helpline */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <div className="relative">
            <div className="flex items-center bg-[#edefe9] p-0.5 rounded-lg border border-[#d8dbd5]">
              <button
                id="lang-btn-mr"
                onClick={() => handleLangChange('mr')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'mr'
                    ? 'bg-[#1b5e3b] text-white shadow-xs'
                    : 'text-[#404942] hover:text-[#191c19]'
                }`}
              >
                मराठी
              </button>
              <button
                id="lang-btn-hi"
                onClick={() => handleLangChange('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-[#1b5e3b] text-white shadow-xs'
                    : 'text-[#404942] hover:text-[#191c19]'
                }`}
              >
                हिंदी
              </button>
              <button
                id="lang-btn-en"
                onClick={() => handleLangChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-[#1b5e3b] text-white shadow-xs'
                    : 'text-[#404942] hover:text-[#191c19]'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Voice Input Button */}
          <button
            id="header-voice-btn"
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
              isListening
                ? 'bg-[#ba1a1a] text-white animate-pulse shadow-md ring-2 ring-red-400'
                : 'bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#004527] border border-[#d8dbd5]'
            }`}
            title={isListening ? 'Stop listening' : 'Speak command (voice search)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#1b5e3b]" />}
            <span className="hidden md:inline">
              {isListening
                ? language === 'mr'
                  ? 'ऐकत आहे...'
                  : language === 'hi'
                  ? 'सुन रहे हैं...'
                  : 'Listening...'
                : language === 'mr'
                ? 'बोला'
                : language === 'hi'
                ? 'बोलें'
                : 'Voice'}
            </span>
          </button>

          {/* Stop Audio Button if currently speaking */}
          {isSpeaking && (
            <button
              id="header-stop-audio-btn"
              onClick={stopSpeaking}
              className="p-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
              title="Stop audio playback"
            >
              <VolumeX className="w-4 h-4 animate-bounce" />
            </button>
          )}

          {/* Kisan Call Center Helpline (Government Toll Free) */}
          <a
            href="tel:18001208040"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f8faf4] border border-[#d8dbd5] text-[#404942] hover:text-[#004527] text-xs font-medium"
            title="Kisan Call Centre Toll-Free Helpline: 1800-120-8040"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#1b5e3b]" />
            <span className="font-mono">1800-120-8040</span>
          </a>

          {/* Profile link or login avatar */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-1.5 pl-1.5 text-xs text-[#404942] hover:text-[#004527]"
              title="Farmer Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-[#e1e3dd] border border-[#bfc9bf] flex items-center justify-center font-bold text-[#1b5e3b]">
                {user.name.charAt(0) || 'F'}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Voice feedback banner when listening or command recognized */}
      {voiceFeedback && (
        <div className="bg-[#f2f4ee] border-t border-[#d8dbd5] px-4 py-1.5 text-xs text-[#191c19] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1b5e3b] animate-ping"></span>
            <span className="font-medium">{voiceFeedback}</span>
          </div>
          <span className="text-[11px] text-[#707971]">
            {language === 'mr' ? 'व्हॉईस आदेश' : language === 'hi' ? 'आवाज कमान्ड' : 'Voice Command'}
          </span>
        </div>
      )}
    </header>
  );
};

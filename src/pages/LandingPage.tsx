import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Camera, AlertTriangle, Sprout, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8faf4] flex flex-col pb-16">
      {/* Hero Section with Rural Agricultural Visual Grounding */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004527] to-[#1b5e3b] text-white px-4 pt-12 pb-16">
        {/* Subtle decorative leaf watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Sprout className="w-80 h-80 text-white" />
        </div>

        <div className="max-w-xl mx-auto text-center relative z-10">
          {/* Civic Seal Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20 mb-6 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#aef2c4]" />
            <span className="text-xs font-semibold tracking-wide text-white">
              {language === 'mr' ? 'महाराष्ट्र शासन • एमएसआयएस कृषी उपक्रम' : t.mahaGov}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight mb-4">
            {t.heroHeadline}
          </h1>

          <p className="text-base sm:text-lg text-emerald-50/90 font-normal leading-relaxed mb-8">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs: Large touch target (52px+) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <button
                id="btn-landing-dashboard"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#fea93e] hover:bg-[#ffb867] text-[#422006] font-bold text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'mr' ? 'माझ्या डॅशबोर्डवर जा' : 'Go to Farmer Dashboard'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <Link
                  id="btn-landing-login"
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-[#004527] font-bold text-base shadow-md transition-all active:scale-95 text-center"
                >
                  {t.login}
                </Link>
                <Link
                  id="btn-landing-register"
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2e7d53] hover:bg-[#349260] text-white font-bold text-base border border-emerald-400/40 shadow-sm transition-all active:scale-95 text-center"
                >
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3 Core Benefits (Simple, Icon-first, low-literacy friendly) */}
      <section className="max-w-xl mx-auto px-4 -mt-8 relative z-20 space-y-4 w-full">
        {/* Benefit 1: Scan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7e9e3] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1b5e3b] flex items-center justify-center shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#004527] font-display flex items-center gap-1.5">
              <span>📷 {t.benefitScanTitle}</span>
            </h2>
            <p className="text-sm text-[#404942] mt-1 leading-normal">
              {t.benefitScanDesc}
            </p>
          </div>
        </div>

        {/* Benefit 2: Risk */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7e9e3] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950 font-display flex items-center gap-1.5">
              <span>⚠️ {t.benefitRiskTitle}</span>
            </h2>
            <p className="text-sm text-[#404942] mt-1 leading-normal">
              {t.benefitRiskDesc}
            </p>
          </div>
        </div>

        {/* Benefit 3: Action */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e7e9e3] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-[#15803d] flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-950 font-display flex items-center gap-1.5">
              <span>🌱 {t.benefitActionTitle}</span>
            </h2>
            <p className="text-sm text-[#404942] mt-1 leading-normal">
              {t.benefitActionDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Scientific Endorsement */}
      <section className="max-w-xl mx-auto px-4 mt-8 text-center">
        <div className="p-4 rounded-xl bg-[#edefe9] border border-[#d8dbd5] flex items-center justify-center gap-2 text-xs text-[#404942]">
          <CheckCircle2 className="w-4 h-4 text-[#1b5e3b]" />
          <span>
            {language === 'mr'
              ? 'महात्मा फुले कृषी विद्यापीठ (MPKV) राहुरी शिफारशींवर आधारित'
              : 'Endorsed by MPKV Rahuri & Agricultural Extension Wings'}
          </span>
        </div>
      </section>
    </div>
  );
};

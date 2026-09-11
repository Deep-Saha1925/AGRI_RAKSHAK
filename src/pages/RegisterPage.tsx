import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Phone, Lock, Globe, ArrowRight } from 'lucide-react';
import { Language } from '../types';

export const RegisterPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(language === 'mr' ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा' : 'Please enter your full name');
      return;
    }
    if (!phone || phone.length < 10) {
      setError(language === 'mr' ? 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा' : 'Please enter valid 10-digit mobile number');
      return;
    }

    try {
      setLanguage(selectedLang);
      await register({
        name,
        phone,
        password: password || 'Farmer@123',
        language: selectedLang,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#f8faf4]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e7e9e3]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1b5e3b] text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <ShieldCheck className="w-8 h-8 text-[#aef2c4]" />
          </div>
          <h1 className="text-2xl font-bold font-display text-[#004527]">
            {t.register}
          </h1>
          <p className="text-xs text-[#707971] mt-1">
            {language === 'mr'
              ? 'महाराष्ट्र राज्य शेतकरी पीक संरक्षण प्रणालीत सामील व्हा'
              : 'Join Maharashtra State Crop Protection & Disease Intelligence'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5">
              {t.fullName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707971]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Patil / राजेश पाटील"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-base text-[#191c19]"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5">
              {t.mobileNumber}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707971]">
                <Phone className="w-4 h-4" />
                <span className="ml-1.5 font-bold text-xs text-[#404942] border-r pr-2 border-gray-300">
                  +91
                </span>
              </div>
              <input
                id="input-register-phone"
                type="tel"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-20 pr-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-base font-semibold text-[#191c19]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707971]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password / संकेतशब्द"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-base text-[#191c19]"
              />
            </div>
          </div>

          {/* Preferred Language Selection */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#1b5e3b]" />
              <span>{t.preferredLanguage}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="reg-lang-mr"
                onClick={() => setSelectedLang('mr')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  selectedLang === 'mr'
                    ? 'bg-[#1b5e3b] text-white border-[#1b5e3b] shadow-xs'
                    : 'bg-[#f2f4ee] text-[#404942] border-[#d8dbd5] hover:bg-[#e7e9e3]'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                id="reg-lang-hi"
                onClick={() => setSelectedLang('hi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  selectedLang === 'hi'
                    ? 'bg-[#1b5e3b] text-white border-[#1b5e3b] shadow-xs'
                    : 'bg-[#f2f4ee] text-[#404942] border-[#d8dbd5] hover:bg-[#e7e9e3]'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="reg-lang-en"
                onClick={() => setSelectedLang('en')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  selectedLang === 'en'
                    ? 'bg-[#1b5e3b] text-white border-[#1b5e3b] shadow-xs'
                    : 'bg-[#f2f4ee] text-[#404942] border-[#d8dbd5] hover:bg-[#e7e9e3]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Contract Notice: Role is automatically 'farmer' */}
          <div className="p-2.5 rounded-xl bg-[#edefe9] text-[11px] text-[#404942] flex items-center justify-between">
            <span>User Role:</span>
            <span className="font-bold text-[#004527] bg-white px-2 py-0.5 rounded border border-[#d8dbd5]">
              farmer (Person 4 UI)
            </span>
          </div>

          {/* Submit */}
          <button
            id="btn-submit-register"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>{t.createFarmerAccount}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#e7e9e3] text-center">
          <Link
            id="link-go-to-login"
            to="/login"
            className="text-xs sm:text-sm font-bold text-[#1b5e3b] hover:text-[#004527] transition-colors"
          >
            {t.alreadyHaveAccount}
          </Link>
        </div>
      </div>
    </div>
  );
};

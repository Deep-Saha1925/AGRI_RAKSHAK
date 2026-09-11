import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Phone, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { login, isLoading, isMockMode } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('Farmer@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.length < 10) {
      setError(language === 'mr' ? 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा' : 'Please enter valid 10-digit mobile number');
      return;
    }

    try {
      await login({ phone, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check credentials or use mock mode.');
    }
  };

  const handleUseDemo = () => {
    setPhone('9876543210');
    setPassword('Farmer@123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#f8faf4]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#e7e9e3]">
        {/* Civic Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1b5e3b] text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <ShieldCheck className="w-8 h-8 text-[#aef2c4]" />
          </div>
          <h1 className="text-2xl font-bold font-display text-[#004527]">
            {t.login}
          </h1>
          <p className="text-xs text-[#707971] mt-1">
            {language === 'mr'
              ? 'आपल्या पिकांच्या संरक्षणासाठी शेतकरी खात्यात प्रवेश करा'
              : 'Sign in to monitor your farm health and risk advisories'}
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        {isMockMode && (
          <div className="mb-5 p-3 rounded-xl bg-[#eef7f0] border border-[#aef2c4] flex items-center justify-between text-xs text-[#004527]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#1b5e3b]" />
              <span>
                <strong>Demo:</strong> 9876543210 (Rajesh Patil)
              </span>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-xs underline font-bold hover:text-[#1b5e3b] cursor-pointer"
            >
              Fill
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone input */}
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
                id="input-login-phone"
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

          {/* Password input */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707971]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-base font-semibold text-[#191c19]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>{language === 'mr' ? 'लॉगिन होत आहे...' : 'Logging in...'}</span>
            ) : (
              <>
                <span>{t.login}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="mt-6 pt-4 border-t border-[#e7e9e3] text-center">
          <Link
            id="link-go-to-register"
            to="/register"
            className="text-xs sm:text-sm font-bold text-[#1b5e3b] hover:text-[#004527] transition-colors"
          >
            {t.createFarmerAccount}
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { getFields } from '../api/fields';
import { getAlerts } from '../api/alerts';
import { Field, FarmerAlert } from '../types';
import { RiskCard } from '../components/RiskCard';
import {
  Camera,
  Sprout,
  Bell,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Activity,
  Mic,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { startListening, isListening } = useVoice();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Field[]>([]);
  const [alerts, setAlerts] = useState<FarmerAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [fieldList, alertList] = await Promise.all([getFields(), getAlerts()]);
        setFields(fieldList);
        setAlerts(alertList);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute unread alert count
  const unreadAlerts = alerts.filter((a) => !a.is_read);

  // Find highest risk field
  const highRiskField = fields.find((f) => f.latest_risk?.risk_level === 'HIGH' || f.latest_risk?.risk_level === 'CRITICAL') ||
    fields.find((f) => f.latest_risk?.risk_level === 'MEDIUM') ||
    fields[0];

  // Farm Health assessment
  const hasHighRisk = fields.some((f) => f.latest_risk?.risk_level === 'HIGH');
  const farmHealthLabel = hasHighRisk
    ? t.attentionNeeded
    : t.mostlyHealthy;
  const farmHealthColor = hasHighRisk ? 'text-amber-600' : 'text-emerald-700';
  const farmHealthBg = hasHighRisk ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-24">
      {/* Farmer Greeting Card */}
      <section className="bg-gradient-to-r from-[#004527] to-[#1b5e3b] text-white px-4 pt-6 pb-8 shadow-xs">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-emerald-200 font-semibold tracking-wide uppercase">
                {getGreeting()} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-0.5">
                {user?.name ? `${user.name}` : t.namasteFarmer}
              </h1>
              <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
                <span>📍 {user?.district || 'Akola, Vidarbha'}</span>
                <span>•</span>
                <span>{language === 'mr' ? 'कापूस व सोयाबीन पट्टा' : 'Cotton & Soybean Zone'}</span>
              </p>
            </div>

            {/* Voice Command Quick Tap */}
            <button
              id="dash-voice-mic"
              onClick={startListening}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                  : 'bg-white/15 hover:bg-white/25 text-[#aef2c4] border border-white/20'
              }`}
              title="Speak voice command"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-6">
            {/* Overall Farm Health */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
              <span className="text-[11px] text-emerald-100 block font-medium">
                {t.farmHealth}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${hasHighRisk ? 'bg-amber-400' : 'bg-emerald-300'} animate-pulse`}></span>
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {farmHealthLabel}
                </span>
              </div>
            </div>

            {/* Registered Fields */}
            <Link
              to="/fields"
              className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15 hover:bg-white/20 transition-colors"
            >
              <span className="text-[11px] text-emerald-100 block font-medium">
                {t.fields}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-white font-display">
                  {fields.length}
                </span>
                <span className="text-[10px] text-emerald-200">
                  {language === 'mr' ? 'प्लॉट' : 'plots'}
                </span>
              </div>
            </Link>

            {/* Unread Alerts */}
            <Link
              to="/alerts"
              className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15 hover:bg-white/20 transition-colors relative"
            >
              <span className="text-[11px] text-emerald-100 block font-medium">
                {t.alerts}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-white font-display">
                  {unreadAlerts.length}
                </span>
                {unreadAlerts.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Primary Action Buttons (Thumb-reachable, 52px+ touch targets) */}
      <section className="max-w-3xl mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary CTA: Scan Your Crop */}
          <button
            id="dash-primary-scan-cta"
            onClick={() => navigate('/scan')}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#004527] to-[#1b5e3b] text-white font-bold text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-between cursor-pointer border border-[#2e7d53]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#aef2c4]" />
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight font-display">{t.scanYourCrop}</span>
                <span className="text-xs text-emerald-100/90 font-normal">
                  {language === 'mr' ? 'रोग ओळखण्यासाठी फोटो काढा' : 'Instant AI leaf diagnosis'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#aef2c4]" />
          </button>

          {/* Secondary CTA: View My Fields */}
          <button
            id="dash-secondary-fields-cta"
            onClick={() => navigate('/fields')}
            className="w-full py-4 px-5 rounded-2xl bg-white text-[#004527] font-bold text-base shadow-sm hover:bg-[#f2f4ee] active:scale-98 transition-all flex items-center justify-between cursor-pointer border border-[#d8dbd5]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#1b5e3b] flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="block text-base leading-tight font-display">{t.viewMyFields}</span>
                <span className="text-xs text-[#707971] font-normal">
                  {fields.length} {language === 'mr' ? 'शेती नोंदी' : 'registered fields'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#707971]" />
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Recent Urgent Alert Card (if any) */}
        {unreadAlerts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#ea580c]" />
                <span>{t.recentAlert}</span>
              </h2>
              <Link to="/alerts" className="text-xs font-bold text-[#1b5e3b] hover:underline">
                {language === 'mr' ? 'सर्व पहा' : 'View All'}
              </Link>
            </div>

            <div className="rounded-2xl p-4 bg-[#fff7ed] border border-[#ffedd5] shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#c2410c] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#9a3412]">
                    {unreadAlerts[0].title}
                  </h3>
                  <span className="text-[10px] text-[#9a3412]/70 font-mono">
                    {language === 'mr' ? 'ताजी' : 'New'}
                  </span>
                </div>
                <p className="text-xs text-[#7c2d12] mt-1 leading-normal">
                  {unreadAlerts[0].message}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => navigate(unreadAlerts[0].action_url || '/fields/1')}
                    className="px-3 py-1.5 rounded-lg bg-[#ea580c] text-white font-bold text-xs hover:bg-[#c2410c] transition-colors"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Highest Risk Section */}
        {highRiskField && highRiskField.latest_risk && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#ea580c]" />
                <span>
                  {language === 'mr' ? 'सध्याचा सर्वाधिक धोका' : 'Current Micro-Climate Risk'}
                </span>
              </h2>
              <Link
                to={`/fields/${highRiskField.id}`}
                className="text-xs font-bold text-[#1b5e3b] hover:underline"
              >
                {t.viewDetails}
              </Link>
            </div>

            <RiskCard
              risk={highRiskField.latest_risk}
              cropName={highRiskField.crop}
              fieldName={highRiskField.name}
            />
          </div>
        )}

        {/* Recent Diagnoses / Farm Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#1b5e3b]" />
              <span>{t.fields}</span>
            </h2>
            <Link
              to="/fields/new"
              className="text-xs font-bold text-[#004527] hover:text-[#1b5e3b] flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.registerNewField}</span>
            </Link>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                id={`field-card-${field.id}`}
                onClick={() => navigate(`/fields/${field.id}`)}
                className="bg-white rounded-2xl p-4 border border-[#e7e9e3] shadow-2xs hover:shadow-sm hover:border-[#1b5e3b] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f2f4ee] text-[#1b5e3b] flex items-center justify-center font-bold text-base shrink-0 border border-[#d8dbd5]">
                    {field.crop.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#191c19] font-display">
                      {field.name}
                    </h3>
                    <p className="text-xs text-[#707971]">
                      {field.crop} • {field.area_acres} {t.acres} • {field.location}
                    </p>
                    {field.latest_diagnosis && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#1b5e3b] font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>{field.latest_diagnosis.disease}</span>
                        <span className="text-[#707971]">
                          ({Math.round(field.latest_diagnosis.confidence * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  {field.latest_risk && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        field.latest_risk.risk_level === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : field.latest_risk.risk_level === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {field.latest_risk.risk_level}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#707971]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

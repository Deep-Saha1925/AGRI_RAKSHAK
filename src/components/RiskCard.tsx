import React from 'react';
import { RiskData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { AlertTriangle, Droplets, Volume2, Info, CloudRain, ShieldCheck } from 'lucide-react';

interface RiskCardProps {
  risk: RiskData;
  cropName?: string;
  fieldName?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, cropName, fieldName }) => {
  const { t, language } = useLanguage();
  const { speakText } = useVoice();

  // Map risk level to UI styling
  const getRiskStyle = () => {
    switch (risk.risk_level) {
      case 'HIGH':
      case 'CRITICAL':
        return {
          bg: 'bg-[#fff5eb]',
          border: 'border-[#f97316]',
          badgeBg: 'bg-[#ea580c] text-white',
          textColor: 'text-[#9a3412]',
          label: t.highRisk,
          icon: <AlertTriangle className="w-5 h-5 text-[#ea580c]" />,
          scoreColor: 'text-[#ea580c]',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-[#fefce8]',
          border: 'border-[#eab308]',
          badgeBg: 'bg-[#ca8a04] text-white',
          textColor: 'text-[#854d0e]',
          label: t.mediumRisk,
          icon: <AlertTriangle className="w-5 h-5 text-[#ca8a04]" />,
          scoreColor: 'text-[#ca8a04]',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-[#f0fdf4]',
          border: 'border-[#22c55e]',
          badgeBg: 'bg-[#16a34a] text-white',
          textColor: 'text-[#166534]',
          label: t.lowRisk,
          icon: <ShieldCheck className="w-5 h-5 text-[#16a34a]" />,
          scoreColor: 'text-[#16a34a]',
        };
    }
  };

  const style = getRiskStyle();

  // Irrigation badge mapping
  const getIrrigationBadge = () => {
    switch (risk.irrigation) {
      case 'WAIT':
        return {
          text: t.irrigationWait,
          bg: 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]',
          icon: <CloudRain className="w-4 h-4" />,
        };
      case 'IRRIGATE':
        return {
          text: t.irrigationIrrigate,
          bg: 'bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc]',
          icon: <Droplets className="w-4 h-4" />,
        };
      case 'DRAIN':
        return {
          text: t.irrigationDrain,
          bg: 'bg-[#ffedd5] text-[#9a3412] border-[#fdba74]',
          icon: <Droplets className="w-4 h-4" />,
        };
      default:
        return {
          text: t.irrigationNormal,
          bg: 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]',
          icon: <Droplets className="w-4 h-4" />,
        };
    }
  };

  const irr = getIrrigationBadge();
  const percentage = Math.round(risk.risk_score * 100);

  const handleHearRisk = () => {
    let speech = '';
    if (language === 'mr') {
      speech = `${fieldName || 'शेती'}: धोक्याची पातळी ${style.label}, ${percentage} टक्के. कारण: ${risk.reason}. पाणी देण्याचा सल्ला: ${irr.text}.`;
    } else if (language === 'hi') {
      speech = `${fieldName || 'खेत'}: जोखिम स्तर ${style.label}, ${percentage} प्रतिशत. कारण: ${risk.reason}. सिंचाई सलाह: ${irr.text}.`;
    } else {
      speech = `${fieldName || 'Field'}: Risk level is ${risk.risk_level}, ${percentage} percent. Reason: ${risk.reason}. Irrigation recommendation: ${risk.irrigation}.`;
    }
    speakText(speech);
  };

  return (
    <div
      id={`risk-card-field-${risk.field_id}`}
      className={`rounded-2xl p-4 sm:p-5 border-2 ${style.bg} ${style.border} shadow-sm transition-all`}
    >
      {/* Header with Risk Level & Hear Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {style.icon}
          <div>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
              {style.label}
            </span>
            {cropName && <span className="text-xs text-[#404942] ml-2 font-medium">{cropName}</span>}
          </div>
        </div>

        {/* Listen Button */}
        <button
          onClick={handleHearRisk}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#d8dbd5] text-[#1b5e3b] hover:bg-[#f2f4ee] shadow-2xs active:scale-95 transition-all cursor-pointer"
          title="Listen to risk explanation"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{t.hearAdvisory}</span>
        </button>
      </div>

      {/* Main Score & Progress Visual */}
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-semibold text-[#404942] block">
            {language === 'mr' ? 'रोग प्रादुर्भाव निर्देशांक' : language === 'hi' ? 'बीमारी जोखिम स्कोर' : 'Disease Risk Probability'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-3xl font-extrabold font-display ${style.scoreColor}`}>
              {percentage}%
            </span>
            <span className="text-xs text-[#707971]">
              ({risk.risk_score.toFixed(2)} score)
            </span>
          </div>
        </div>

        {/* Irrigation Advice Pill */}
        <div className="text-right">
          <span className="text-[11px] font-semibold text-[#707971] block uppercase tracking-wider mb-1">
            {t.irrigation}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${irr.bg}`}>
            {irr.icon}
            {irr.text}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-white/80 rounded-full mt-3 overflow-hidden border border-[#d8dbd5]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            percentage > 70 ? 'bg-[#ea580c]' : percentage > 40 ? 'bg-[#ca8a04]' : 'bg-[#16a34a]'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Reason text */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#707971] shrink-0 mt-0.5" />
        <p className="text-xs text-[#191c19] font-medium leading-relaxed">
          <strong className="font-semibold text-[#404942]">{t.riskReason}: </strong>
          {risk.reason}
        </p>
      </div>

      {/* Note for Person 2 / Person 3 Contract */}
      {/* <div className="mt-2 text-[10px] text-[#707971] flex items-center justify-between">
        <span>Updated: {new Date(risk.computed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="font-mono text-[9px] bg-black/5 px-1.5 py-0.5 rounded">Person 2 Model → Person 3 API</span>
      </div> */}
    </div>
  );
};

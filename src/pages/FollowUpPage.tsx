import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { scheduleRecheck } from '../api/advisory';
import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  ThumbsUp,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';

export const FollowUpPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const diagnosisId = searchParams.get('diagnosisId') || '101';
  const diseaseName = searchParams.get('disease') || 'Early Blight';

  const [daysAfter, setDaysAfter] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [outcome, setOutcome] = useState<'recovered' | 'unchanged' | 'worsened' | null>(null);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Compute scheduled target date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAfter);
  const formattedDate = targetDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await scheduleRecheck({
        diagnosis_id: Number(diagnosisId),
        scheduled_for: targetDate.toISOString().split('T')[0],
        notes: notes || `Follow-up recheck after ${daysAfter} days of IPM treatment.`,
      });
      setScheduledSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>
        <span className="text-xs font-mono text-[#707971]">
          Diagnosis #{diagnosisId}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#e7e9e3] shadow-xs space-y-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-block mb-1.5">
            Recovery Tracking
          </span>
          <h1 className="text-2xl font-bold font-display text-[#004527]">
            {t.scheduleFollowUp}
          </h1>
          <p className="text-xs text-[#707971] mt-0.5">
            {language === 'mr'
              ? `${diseaseName} वरील औषध फवारणीनंतर ५ दिवसांनी फेरतपासणी निश्चित करा`
              : `Monitor crop recovery for ${diseaseName} and log whether symptoms subsided`}
          </p>
        </div>

        {scheduledSuccess ? (
          <div className="p-5 rounded-2xl bg-[#eef7f0] border border-[#aef2c4] text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
            <h2 className="text-base font-bold text-[#004527]">
              {language === 'mr' ? 'फेरतपासणी यशस्वीरित्या नोंदवली!' : 'Recheck Scheduled Successfully!'}
            </h2>
            <p className="text-xs text-[#404942]">
              {language === 'mr'
                ? `आम्ही तुम्हाला ${formattedDate} रोजी स्मरणपत्र पाठवू.`
                : `CropShield will send an alert reminder on ${formattedDate}.`}
            </p>

            {/* Quick Outcome Logger */}
            <div className="mt-4 pt-4 border-t border-[#d8dbd5] text-left">
              <span className="text-xs font-bold text-[#404942] uppercase tracking-wider block mb-2">
                {language === 'mr' ? 'लक्षणे कशी आहेत? (Log Symptom Outcome)' : 'Did the treatment work? Log Outcome'}
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOutcome('recovered')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    outcome === 'recovered'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white border-[#d8dbd5] hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mx-auto mb-1" />
                  <span>{language === 'mr' ? 'सुधारणा झाली' : 'Recovered'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOutcome('unchanged')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    outcome === 'unchanged'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white border-[#d8dbd5] hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <span>{language === 'mr' ? 'काही फरक नाही' : 'Same'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOutcome('worsened')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    outcome === 'worsened'
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white border-[#d8dbd5] hover:bg-gray-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                  <span>{language === 'mr' ? 'लक्षणे वाढली' : 'Worsened'}</span>
                </button>
              </div>

              {outcome === 'worsened' && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  <p className="font-bold">⚠️ Escalation Advised:</p>
                  <p className="mt-0.5">
                    {language === 'mr'
                      ? 'लक्षणे वाढत असल्यास स्वतः आणखी रसायने फवारू नका. त्वरित कृषी अधिकाऱ्यांशी संपर्क साधा.'
                      : 'Symptoms expanding despite treatment. Please consult the Block Agriculture Officer or Kisan Helpline immediately.'}
                  </p>
                  <a
                    href="tel:18001801551"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-red-900 underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Kisan Helpline 1800-180-1551</span>
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#004527] text-white font-bold text-xs"
            >
              {t.home}
            </button>
          </div>
        ) : (
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            {/* Days selection */}
            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-2">
                {language === 'mr' ? 'कधी तपासणी करायची आहे? (Days after spray)' : 'Recheck Interval (Days After Spray)'}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[3, 5, 7].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysAfter(days)}
                    className={`py-3 px-3 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                      daysAfter === days
                        ? 'bg-[#004527] text-white border-[#004527] shadow-xs'
                        : 'bg-white text-[#404942] border-[#d8dbd5] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg block leading-none">{days}</span>
                    <span className="text-[11px] font-normal">
                      {language === 'mr' ? 'दिवसांनी' : 'Days'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Date Preview */}
            <div className="p-3 rounded-xl bg-[#f2f4ee] border border-[#d8dbd5] flex items-center justify-between text-xs">
              <span className="text-[#404942] font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1b5e3b]" />
                <span>Scheduled Date:</span>
              </span>
              <span className="font-bold text-[#004527]">{formattedDate}</span>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {language === 'mr' ? 'फवारणीची नोंद (औषधाचे नाव किंवा टीप)' : 'Treatment / Spray Notes (Optional)'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sprayed Copper Oxychloride 50 WP as advised"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8dbd5] focus:ring-2 focus:ring-[#1b5e3b] focus:outline-none text-xs text-[#191c19]"
              />
            </div>

            {/* Submit */}
            <button
              id="btn-confirm-schedule"
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-4 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Scheduling...' : 'Confirm Recheck Schedule'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

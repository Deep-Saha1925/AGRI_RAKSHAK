import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getFieldById } from '../api/fields';
import { Field } from '../types';
import { RiskCard } from '../components/RiskCard';
import { deleteField } from '../api/fields';
import {
  Camera,
  ArrowLeft,
  Sprout,
  MapPin,
  Calendar,
  Layers,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export const FieldDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteField = async () => {
  if (!field) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${field.name}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    await deleteField(field.id);
    navigate('/fields');
  } catch (error) {
    console.error('Failed to delete field:', error);
    alert('Unable to delete the field. Please try again.');
  }
};
  useEffect(() => {
    const fetchField = async () => {
      if (!id) return;
      try {
        const data = await getFieldById(id);
        setField(data);
      } catch (err) {
        console.error('Failed to load field detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchField();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf4] flex items-center justify-center p-4">
        <div className="text-center text-sm text-[#707971]">
          {language === 'mr' ? 'शेती तपशील लोड होत आहेत...' : 'Loading field details...'}
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-[#f8faf4] p-4 max-w-xl mx-auto text-center pt-16">
        <h2 className="text-lg font-bold text-[#191c19]">Field not found</h2>
        <button
          onClick={() => navigate('/fields')}
          className="mt-4 px-4 py-2 rounded-xl bg-[#004527] text-white font-bold text-xs"
        >
          {t.back}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-3xl mx-auto space-y-5">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-from-field-detail"
          onClick={() => navigate('/fields')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <span className="text-xs font-mono text-[#707971]">Field #{field.id}</span>
      </div>

      {/* Field Overview Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#e7e9e3] shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eef7f0] text-[#1b5e3b] text-xs font-bold mb-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>{field.crop}</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-[#004527]">
              {field.name}
            </h1>
            <p className="text-xs text-[#707971] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#1b5e3b]" />
              <span>{field.location}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-display text-[#1b5e3b]">
              {field.area_acres}
            </span>
            <span className="text-xs text-[#707971] block font-medium">{t.acres}</span>
          <button
            id="btn-delete-field"
            onClick={handleDeleteField}
            className="w-full py-3 px-5 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Trash2 className="w-4 h-4" />
            <span>
              {language === 'mr' ? 'शेत हटवा' : 'Delete Field'}
            </span>
          </button>
          </div>
        </div>

        {/* Agronomic Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#f2f4ee] text-xs">
          <div>
            <span className="text-[#707971] block">{t.variety}</span>
            <span className="font-bold text-[#191c19]">{field.variety || 'Standard Hybrid'}</span>
          </div>
          <div>
            <span className="text-[#707971] block">{t.growthStage}</span>
            <span className="font-bold text-[#191c19]">{field.growth_stage || 'Vegetative'}</span>
          </div>
          <div>
            <span className="text-[#707971] block">Soil Type</span>
            <span className="font-bold text-[#191c19]">{field.soil_type || 'Deep Black Cotton'}</span>
          </div>
        </div>
      </div>

      {/* Primary Action CTA: Scan This Field */}
      <div>
        <button
          id="btn-scan-this-field"
          onClick={() => navigate(`/scan?fieldId=${field.id}`)}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#004527] to-[#1b5e3b] text-white font-bold text-base shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-between cursor-pointer border border-[#2e7d53]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#aef2c4]" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-display">{t.scanThisField}</span>
              <span className="text-xs text-emerald-100 font-normal">
                {language === 'mr' ? 'या शेतातील पानावरील रोगाचा फोटो घ्या' : 'Capture affected leaf for this plot'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#aef2c4]" />
        </button>
      </div>

      {/* Micro-climate Risk Card */}
      {field.latest_risk && (
        <div>
          <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#ea580c]" />
            <span>{language === 'mr' ? 'हवामान व रोग धोका निर्देशांक' : 'Micro-Climate Disease Risk'}</span>
          </h2>
          <RiskCard
            risk={field.latest_risk}
            cropName={field.crop}
            fieldName={field.name}
          />
        </div>
      )}

      {/* Latest Diagnosis Section */}
      <div>
        <h2 className="text-xs font-bold text-[#404942] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-[#1b5e3b]" />
          <span>{t.latestDiagnosis}</span>
        </h2>

        {field.latest_diagnosis ? (
          <div className="bg-white rounded-3xl p-5 border border-[#e7e9e3] shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-[#1b5e3b] uppercase tracking-wider">
                    {field.latest_diagnosis.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-[#191c19] mt-1">
                  {field.latest_diagnosis.disease}
                </h3>
                <p className="text-xs text-[#707971] mt-0.5">
                  {t.confidence}:{' '}
                  <strong className="text-[#004527] font-bold">
                    {Math.round(field.latest_diagnosis.confidence * 100)}%
                  </strong>{' '}
                  • {field.latest_diagnosis.routed_to === 'farmer' ? 'AI-diagnosed' : 'Officer review'}
                </p>
              </div>

              {/* View Diagnosis Button */}
              <button
                id="btn-view-field-diagnosis"
                onClick={() => navigate(`/diagnosis/${field.latest_diagnosis?.diagnosis_id}`)}
                className="px-4 py-2.5 rounded-xl bg-[#eef7f0] hover:bg-[#1b5e3b] text-[#1b5e3b] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>{t.viewDiagnosis}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 text-center border border-[#e7e9e3] text-xs text-[#707971]">
            {language === 'mr' ? 'या शेतासाठी कोणतेही ताजे निदान उपलब्ध नाही.' : 'No recent diagnosis recorded for this field.'}
          </div>
        )}
      </div>
    </div>
  );
};

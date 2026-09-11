import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getFields , deleteField} from '../api/fields';
import { Field } from '../types';
import { Sprout, Plus, ChevronRight, AlertTriangle, ShieldCheck, MapPin, Trash2, } from 'lucide-react';

export const MyFieldsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const list = await getFields();
        setFields(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const getRiskBadge = (level?: string) => {
    switch (level) {
      case 'HIGH':
      case 'CRITICAL':
        return {
          text: '🔴 ' + t.highRisk,
          bg: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'MEDIUM':
        return {
          text: '🟡 ' + t.mediumRisk,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'LOW':
      default:
        return {
          text: '🟢 ' + t.lowRisk,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
    }
  };

  const handleDeleteField = async (field: Field) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${field.name}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    await deleteField(field.id);

    setFields((currentFields) =>
      currentFields.filter((item) => item.id !== field.id)
    );
  } catch (error) {
    console.error('Failed to delete field:', error);
    alert('Unable to delete the field. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-24 px-4 pt-4 max-w-3xl mx-auto">
      {/* Header & Registration CTA */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#004527]">
            {t.viewMyFields}
          </h1>
          <p className="text-xs text-[#707971] mt-0.5">
            {language === 'mr' ? 'नोंदणीकृत शेतजमीन व पीक आरोग्य' : 'Registered plots and current risk state'}
          </p>
        </div>

        <button
          id="btn-add-field-top"
          onClick={() => navigate('/fields/new')}
          className="px-4 py-2.5 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.registerNewField}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#707971] text-sm">
          {language === 'mr' ? 'शेती नोंदी लोड होत आहेत...' : 'Loading field records...'}
        </div>
      ) : fields.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl p-6 border border-[#e7e9e3]">
          <Sprout className="w-12 h-12 text-[#1b5e3b] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#191c19] mb-1">
            {language === 'mr' ? 'कोणतीही शेती नोंदणीकृत नाही' : 'No fields registered yet'}
          </h2>
          <p className="text-xs text-[#707971] max-w-sm mx-auto mb-5">
            {language === 'mr'
              ? 'आपले पहिले शेत जोडून हवामानाचा धोका व रोगांची तपासणी सुरू करा.'
              : 'Register your first field plot to track disease risks and localized irrigation.'}
          </p>
          <button
            onClick={() => navigate('/fields/new')}
            className="px-6 py-3 rounded-xl bg-[#004527] text-white font-bold text-sm shadow-md hover:bg-[#1b5e3b]"
          >
            {t.registerNewField}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {fields.map((field) => {
            const risk = getRiskBadge(field.latest_risk?.risk_level);
            return (
              <div
                key={field.id}
                id={`field-row-${field.id}`}
                className="bg-white rounded-3xl p-5 border border-[#e7e9e3] shadow-xs hover:border-[#1b5e3b] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#eef7f0] text-[#1b5e3b] flex items-center justify-center font-bold text-lg shrink-0 border border-[#aef2c4]">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#004527] font-display">
                      {field.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#404942] mt-0.5">
                      <span className="font-semibold text-[#191c19]">{field.crop}</span>
                      <span>•</span>
                      <span>{field.area_acres} {t.acres}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#707971]" />
                        {field.location}
                      </span>
                    </div>

                    {field.growth_stage && (
                      <p className="text-[11px] text-[#707971] mt-1">
                        Stage: <span className="font-medium text-[#191c19]">{field.growth_stage}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f2f4ee]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#707971] block font-bold uppercase tracking-wider mb-0.5">
                      Risk Level
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${risk.bg}`}>
                      {risk.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                  <button
                    id={`btn-delete-field-${field.id}`}
                    onClick={() => handleDeleteField(field)}
                    className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Delete field">
                    <Trash2 className="w-3 h-4" />
                    <span>Delete Field</span>
                  </button>
                  </div>
                  <button
                    id={`btn-open-field-${field.id}`}
                    onClick={() => navigate(`/fields/${field.id}`)}
                    className="px-4 py-2.5 rounded-xl bg-[#f2f4ee] hover:bg-[#004527] text-[#004527] hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'mr' ? 'उघडा' : language === 'hi' ? 'क्षेत्र खोला' : 'Open Field'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

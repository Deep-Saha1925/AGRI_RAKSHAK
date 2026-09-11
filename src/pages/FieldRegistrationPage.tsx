import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { createField, RawFieldFormData } from '../api/fields';
import { ArrowLeft, Sprout, MapPin, Layers, Save, Code } from 'lucide-react';

export const FieldRegistrationPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RawFieldFormData>({
    fieldName: '',
    crop: 'Cotton',
    variety: '',
    growthStage: 'Flowering & Boll formation',
    soilType: 'Black Cotton Soil (Regur)',
    areaAcres: '4',
    location: 'Akola, Vidarbha',
    lat: 20.7002,
    lng: 77.0082,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fieldName.trim()) {
      setError(language === 'mr' ? 'कृपया शेताचे नाव प्रविष्ट करा' : 'Please enter a field name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await createField(formData);
      navigate(`/fields/${response.field_id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to register field. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-2xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/fields')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e3b] hover:text-[#004527] p-2 rounded-lg hover:bg-[#edefe9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <span className="text-xs text-[#707971] flex items-center gap-1">
          <Code className="w-3.5 h-3.5 text-[#2b4c7e]" />
          {/* <span>Isolated Person 3 Hook Active</span> */}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#e7e9e3] shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#eef7f0] text-[#1b5e3b] flex items-center justify-center font-bold text-lg shrink-0 border border-[#aef2c4]">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-[#004527]">
              {t.registerNewField}
            </h1>
            <p className="text-xs text-[#707971]">
              {language === 'mr'
                ? 'स्थानिक हवामान व रोगांच्या अचूक निदानासाठी शेताची माहिती भरा'
                : 'Enter field plot details for micro-climate risk triggers and disease tracking'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field Name */}
          <div>
            <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
              {t.fieldName} *
            </label>
            <input
              type="text"
              required
              value={formData.fieldName}
              onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
              placeholder="e.g. Cotton Plot 3 / कापूस शेत ३"
              className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19]"
            />
          </div>

          {/* Crop & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {t.crop} *
              </label>
              <select
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19] bg-white"
              >
                <option value="Cotton">Cotton ({t.cotton})</option>
                <option value="Soybean">Soybean ({t.soybean})</option>
                <option value="Sugarcane">Sugarcane ({t.sugarcane})</option>
                <option value="Maize">Maize ({t.Maize})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {t.variety}
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. Bt Cotton (RCH-659), JS-335"
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19]"
              />
            </div>
          </div>

          {/* Growth Stage & Soil Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {t.growthStage}
              </label>
              <select
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19] bg-white"
              >
                <option value="Seedling / Vegetative">Seedling / Vegetative (रोपावस्था)</option>
                <option value="Flowering & Boll formation">Flowering & Boll (फुलोरा व बोंड)</option>
                <option value="Pod development">Pod development (शेंगा भरणे)</option>
                <option value="Maturity & Harvesting">Maturity (पक्वता)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                Soil Type (मातीचा प्रकार)
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19] bg-white"
              >
                <option value="Black Cotton Soil (Regur)">Deep Black Cotton Soil (काळी माती)</option>
                <option value="Medium Black Soil">Medium Black Soil (मध्यम काळी)</option>
                <option value="Red Sandy Loam">Red Sandy Loam (तांबडी माती)</option>
                <option value="Laterite Soil">Laterite Soil (जांभा)</option>
              </select>
            </div>
          </div>

          {/* Area & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {t.area} *
              </label>
              <input
                type="number"
                min="0.25"
                step="0.25"
                required
                value={formData.areaAcres}
                onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
                placeholder="4"
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404942] uppercase tracking-wider mb-1">
                {t.location} *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Akola, Vidarbha / लातूर"
                className="w-full px-4 py-3 rounded-xl border border-[#d8dbd5] focus:outline-none focus:ring-2 focus:ring-[#1b5e3b] text-sm text-[#191c19]"
              />
            </div>
          </div>

          {/* Person 3 isolation contract note */}
          {/* <div className="p-3 bg-[#f2f4ee] rounded-xl border border-[#d8dbd5] text-[11px] text-[#404942]">
            <p className="font-semibold text-[#004527]">
              Person 3 API Hook Notice:
            </p>
            <p className="text-[#707971] mt-0.5">
              POST /fields/ payload is mapped inside <code>src/api/fields.ts :: formatFieldPayload()</code>. Person 3 can modify the JSON structure without touching form component code.
            </p>
          </div> */}

          {/* Submit */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/fields')}
              className="w-1/3 py-3 rounded-xl border border-[#d8dbd5] text-[#707971] font-bold text-sm hover:bg-[#f2f4ee]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl bg-[#004527] hover:bg-[#1b5e3b] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

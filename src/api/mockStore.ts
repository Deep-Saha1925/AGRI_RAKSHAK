import {
  initialMockUser,
  initialMockFields,
  initialMockAlerts,
  mockAdvisories,
} from './mockData';
import { Field, FarmerAlert, Diagnosis, AdvisoryPlan, RecheckResult } from '../types';

const STORAGE_KEYS = {
  USER: 'cropshield_mock_user',
  FIELDS: 'cropshield_mock_fields',
  ALERTS: 'cropshield_mock_alerts',
  DIAGNOSES: 'cropshield_mock_diagnoses',
  RECHECKS: 'cropshield_mock_rechecks',
};

// Initialize Mock Store if not present
export const initializeMockStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialMockUser));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FIELDS)) {
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(initialMockFields));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(initialMockAlerts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DIAGNOSES)) {
    const defaultDiagnoses: Record<number, Diagnosis> = {
      45: {
        diagnosis_id: 45,
        field_id: 1,
        field_name: 'Cotton — Field 1',
        crop: 'Cotton',
        disease: 'Early Blight',
        confidence: 0.91,
        status: 'Disease Detected',
        routed_to: 'farmer',
        created_at: '2026-09-02T10:30:00Z',
        image_url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
      },
      46: {
        diagnosis_id: 46,
        field_id: 2,
        field_name: 'Soybean — Field 2',
        crop: 'Soybean',
        disease: 'Unknown Leaf Spot',
        confidence: 0.62,
        status: 'pending_review',
        routed_to: 'officer',
        created_at: '2026-09-01T15:20:00Z',
        image_url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
        officer_notes: 'Under review by Taluka Agricultural Officer (MPKV Rahuri Extension).',
      },
    };
    localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify(defaultDiagnoses));
  }
};

export const getMockFields = (): Field[] => {
  initializeMockStore();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FIELDS) || '[]');
  } catch {
    return initialMockFields;
  }
};

export const saveMockField = (fieldData: Partial<Field>): Field => {
  const fields = getMockFields();
  const newId = fields.length > 0 ? Math.max(...fields.map((f) => f.id)) + 1 : 1;
  const newField: Field = {
    id: newId,
    name: fieldData.name || `Field ${newId}`,
    crop: fieldData.crop || 'Cotton',
    variety: fieldData.variety || 'Standard Local',
    growth_stage: fieldData.growth_stage || 'Vegetative',
    soil_type: fieldData.soil_type || 'Black Soil',
    area_acres: Number(fieldData.area_acres) || 2,
    location: fieldData.location || 'Maharashtra',
    lat: fieldData.lat || 20.93,
    lng: fieldData.lng || 77.75,
    created_at: new Date().toISOString(),
    latest_risk: {
      field_id: newId,
      risk_level: 'LOW',
      risk_score: 0.22,
      irrigation: 'NORMAL',
      reason: 'Favorable seasonal climate. Regular monitoring advised.',
      computed_at: new Date().toISOString(),
    },
  };
  fields.unshift(newField);
  localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
  return newField;
};

export const getMockFieldById = (id: number): Field | undefined => {
  const fields = getMockFields();
  return fields.find((f) => f.id === Number(id));
};

export const deleteMockField = (id: number): boolean => {
  const fields = getMockFields();

  const filteredFields = fields.filter(
    (field) => field.id !== Number(id)
  );

  if (filteredFields.length === fields.length) {
    return false;
  }

  localStorage.setItem(
    STORAGE_KEYS.FIELDS,
    JSON.stringify(filteredFields)
  );

  return true;
};

export const getMockDiagnoses = (): Record<number, Diagnosis> => {
  initializeMockStore();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DIAGNOSES) || '{}');
  } catch {
    return {};
  }
};

export const getMockDiagnosisById = (id: number): Diagnosis | undefined => {
  const list = getMockDiagnoses();
  return list[id];
};

export const saveMockDiagnosis = (diag: Diagnosis) => {
  const list = getMockDiagnoses();
  list[diag.diagnosis_id] = diag;
  localStorage.setItem(STORAGE_KEYS.DIAGNOSES, JSON.stringify(list));

  // Also update field's latest_diagnosis
  if (diag.field_id) {
    const fields = getMockFields();
    const target = fields.find((f) => f.id === diag.field_id);
    if (target) {
      target.latest_diagnosis = diag;
      localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    }
  }

  // Create an alert automatically
  const alerts = getMockAlerts();
  const newAlertId = alerts.length > 0 ? Math.max(...alerts.map((a) => a.id)) + 1 : 100;
  if (diag.routed_to === 'farmer') {
    alerts.unshift({
      id: newAlertId,
      type: 'DIAGNOSIS_READY',
      title: `🌱 DIAGNOSIS READY: ${diag.crop || 'Crop'} Scan`,
      message: `Your crop scan has been analyzed. ${diag.disease} detected with ${Math.round(diag.confidence * 100)}% AI confidence.`,
      field_id: diag.field_id,
      diagnosis_id: diag.diagnosis_id,
      disease: diag.disease,
      is_read: false,
      created_at: new Date().toISOString(),
      action_url: `/diagnosis/${diag.diagnosis_id}`,
    });
  } else {
    alerts.unshift({
      id: newAlertId,
      type: 'EXPERT_REVIEW',
      title: `👨‍🌾 EXPERT REVIEW: Case #${diag.diagnosis_id}`,
      message: `Confidence is ${Math.round(diag.confidence * 100)}%. Your case was routed to the Taluka Agriculture Officer for verification.`,
      field_id: diag.field_id,
      diagnosis_id: diag.diagnosis_id,
      is_read: false,
      created_at: new Date().toISOString(),
      action_url: `/diagnosis/${diag.diagnosis_id}`,
    });
  }
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
};

export const getMockAlerts = (): FarmerAlert[] => {
  initializeMockStore();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]');
  } catch {
    return initialMockAlerts;
  }
};

export const markMockAlertRead = (id: number): boolean => {
  const alerts = getMockAlerts();
  const alert = alerts.find((a) => a.id === Number(id));
  if (alert) {
    alert.is_read = true;
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return true;
  }
  return false;
};

export const getMockAdvisory = (disease: string): AdvisoryPlan => {
  if (mockAdvisories[disease]) {
    return mockAdvisories[disease];
  }
  // Default fallback IPM plan
  return {
    disease,
    steps: [
      `Remove and isolate any leaves displaying severe symptoms of ${disease}.`,
      'Apply bio-formulation (Neem oil 10,000 ppm @ 3ml/L) or university-certified protective spray.',
      'Monitor field moisture and check crops for 5 days.',
      'Escalate to district agriculture extension officer if lesions spread.',
    ],
    escalate_if: 'Spread accelerates to more than 20% of the farm plot within 5 days.',
  };
};

export const saveMockRecheck = (diagnosisId: number, scheduledFor: string) => {
  const rechecks = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECHECKS) || '[]');
  rechecks.push({
    diagnosis_id: diagnosisId,
    scheduled_for: scheduledFor,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.RECHECKS, JSON.stringify(rechecks));
};

export const recordMockRecheckResult = (
  recheckId: number,
  status: 'improved' | 'worsened',
  newDiagnosisId?: number
): RecheckResult => {
  return {
    recheck_id: recheckId,
    status,
    new_diagnosis_id: newDiagnosisId,
    submitted_at: new Date().toISOString(),
  };
};

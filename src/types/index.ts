export type Language = 'en' | 'mr' | 'hi';

export type UserRole = 'farmer' | 'officer';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  language: Language;
  phone: string;
  village?: string;
  taluka?: string;
  district?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  role: UserRole;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IrrigationAdvice = 'WAIT' | 'IRRIGATE' | 'DRAIN' | 'NORMAL';

export interface RiskData {
  field_id: number;
  risk_level: RiskLevel;
  risk_score: number; // e.g. 0.78
  irrigation: IrrigationAdvice;
  reason: string;
  computed_at: string;
}

export type DiagnosisStatus =
  | 'pending_review'
  | 'routed_farmer'
  | 'routed_officer'
  | 'verified';

export type RoutedTo = 'farmer' | 'officer';

export interface Diagnosis {
  diagnosis_id: number;
  field_id?: number;
  field_name?: string;
  crop?: string;
  disease: string;
  confidence: number; // e.g. 0.91 or 0.62
  status: string | DiagnosisStatus; // "Disease Detected", "pending_review", etc.
  routed_to: RoutedTo;
  image_url?: string;
  created_at: string;
  verified?: boolean;
  officer_notes?: string;
}

export type DiagnosisResult = Diagnosis;

export interface Field {
  id: number;
  name: string;
  crop: string;
  variety?: string;
  growth_stage?: string;
  soil_type?: string;
  area_acres: number;
  location: string;
  lat?: number;
  lng?: number;
  latest_risk?: RiskData;
  latest_diagnosis?: Diagnosis;
  created_at: string;
}

export interface AdvisoryStep {
  step_number: number;
  title: string;
  action: string;
}

export interface AdvisoryData {
  disease: string;
  crop?: string;
  steps: AdvisoryStep[];
  escalate_if: string;
  caution?: string;
  organic_treatment?: string;
  chemical_treatment?: string;
}

export interface AdvisoryPlan {
  disease: string;
  crop?: string;
  steps: string[] | AdvisoryStep[];
  escalate_if: string;
  caution?: string;
  organic_treatment?: string;
  chemical_treatment?: string;
}

export interface RecheckSchedule {
  diagnosis_id: number;
  scheduled_for: string; // ISO string or date
  notes?: string;
}

export interface RecheckResult {
  recheck_id: number;
  status: 'improved' | 'worsened';
  new_diagnosis_id?: number;
  notes?: string;
  submitted_at: string;
}

export type AlertType = 'HIGH_RISK' | 'DIAGNOSIS_READY' | 'EXPERT_REVIEW' | 'ADVISORY_READY';

export interface FarmerAlert {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  field_id?: number;
  field_name?: string;
  diagnosis_id?: number;
  disease?: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

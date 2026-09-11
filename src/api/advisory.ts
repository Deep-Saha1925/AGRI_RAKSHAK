import { apiClient, isMockModeEnabled } from './client';
import { getMockAdvisory, saveMockRecheck, recordMockRecheckResult } from './mockStore';
import { AdvisoryPlan, AdvisoryData, AdvisoryStep, RecheckResult } from '../types';

/**
 * GET /advisory/{disease}/
 */
export const getAdvisory = async (disease: string): Promise<AdvisoryPlan> => {
  if (isMockModeEnabled()) {
    return getMockAdvisory(disease);
  }

  const encodedDisease = encodeURIComponent(disease);
  const response = await apiClient.get<AdvisoryPlan>(`/advisory/${encodedDisease}/`);
  return response.data;
};

/**
 * Normalized 4-step IPM advisory reader for UI pages
 */
export const getAdvisoryByDisease = async (disease: string): Promise<AdvisoryData> => {
  const plan = await getAdvisory(disease);

  const stepTitles = [
    'Cultural Control: Remove infected leaves & border weeds',
    'Safe Treatment: Apply certified bio or chemical formulation',
    'Field Monitoring: Inspect daily for 5-7 days',
    'Escalation Protocol: Threshold for officer consultation',
  ];

  const steps: AdvisoryStep[] = (plan.steps || []).map((s: any, idx: number) => {
    if (typeof s === 'string') {
      return {
        step_number: idx + 1,
        title: stepTitles[idx] || `Step ${idx + 1}`,
        action: s,
      };
    }
    return s as AdvisoryStep;
  });

  return {
    disease: plan.disease || disease,
    crop: plan.crop,
    steps,
    escalate_if: plan.escalate_if || 'Symptoms continue spreading after 5 days.',
    caution: plan.caution,
  };
};

export interface ScheduleRecheckParams {
  diagnosis_id: number;
  scheduled_for: string; // ISO date string
  notes?: string;
}

/**
 * POST /advisory/recheck/
 */
export const scheduleRecheck = async (
  params: ScheduleRecheckParams
): Promise<{ success: boolean; message?: string }> => {
  if (isMockModeEnabled()) {
    saveMockRecheck(params.diagnosis_id, params.scheduled_for);
    return { success: true, message: 'Follow-up scheduled successfully' };
  }

  const response = await apiClient.post('/advisory/recheck/', params);
  return response.data;
};

export interface SubmitRecheckResultParams {
  status: 'improved' | 'worsened';
  new_diagnosis_id?: number;
}

/**
 * POST /advisory/recheck/{id}/result/
 */
export const submitRecheckResult = async (
  recheckId: number | string,
  params: SubmitRecheckResultParams
): Promise<RecheckResult> => {
  if (isMockModeEnabled()) {
    return recordMockRecheckResult(Number(recheckId), params.status, params.new_diagnosis_id);
  }

  const response = await apiClient.post<RecheckResult>(
    `/advisory/recheck/${recheckId}/result/`,
    params
  );
  return response.data;
};

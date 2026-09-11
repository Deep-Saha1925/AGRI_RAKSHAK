import { apiClient, isMockModeEnabled } from './client';
import { getMockFieldById } from './mockStore';
import { RiskData } from '../types';

/**
 * GET /risk/{field_id}/latest/
 *
 * NOTE: Person 4 strictly consumes calculated risk records from Person 3.
 * Person 4 NEVER calls external weather APIs directly.
 */
export const getLatestRisk = async (fieldId: number | string): Promise<RiskData> => {
  if (isMockModeEnabled()) {
    const field = getMockFieldById(Number(fieldId));
    if (field?.latest_risk) {
      return field.latest_risk;
    }
    // Fallback default
    return {
      field_id: Number(fieldId),
      risk_level: 'MEDIUM',
      risk_score: 0.5,
      irrigation: 'NORMAL',
      reason: 'Standard seasonal atmospheric humidity.',
      computed_at: new Date().toISOString(),
    };
  }

  const response = await apiClient.get<RiskData>(`/risk/${fieldId}/latest/`);
  return response.data;
};

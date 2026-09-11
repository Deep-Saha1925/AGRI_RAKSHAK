import { apiClient, isMockModeEnabled } from './client';
import { getMockAlerts, markMockAlertRead } from './mockStore';
import { FarmerAlert } from '../types';

/**
 * GET /alerts/
 * Returns farmer unread alerts (and recent history)
 */
export const getAlerts = async (): Promise<FarmerAlert[]> => {
  if (isMockModeEnabled()) {
    return getMockAlerts();
  }

  const response = await apiClient.get<FarmerAlert[]>('/alerts/');
  return response.data;
};

/**
 * POST /alerts/{id}/read/
 */
export const markAlertRead = async (id: number | string): Promise<{ success: boolean }> => {
  if (isMockModeEnabled()) {
    markMockAlertRead(Number(id));
    return { success: true };
  }

  const response = await apiClient.post<{ success: boolean }>(`/alerts/${id}/read/`);
  return response.data;
};

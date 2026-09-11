import { apiClient, isMockModeEnabled } from './client';
import { getMockDiagnosisById, saveMockDiagnosis, getMockFieldById } from './mockStore';
import { Diagnosis } from '../types';

export interface DiagnosisSubmissionOptions {
  fieldId: number;
  imageFile?: File | Blob;
  imageUrl?: string;
  // Allows the demo tester to force high or low confidence flow
  forceConfidenceScenario?: 'high' | 'low';
}

export interface DiagnosisResponse {
  diagnosis_id: number;
  disease: string;
  confidence: number;
  status: string;
  routed_to: 'farmer' | 'officer';
  field_id?: number;
}

/**
 * POST /diagnosis/
 * multipart/form-data: field_id, image
 */
export const submitDiagnosis = async (
  options: DiagnosisSubmissionOptions
): Promise<DiagnosisResponse> => {
  if (isMockModeEnabled()) {
    // Generate simulated diagnosis with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const isLowConfidence = options.forceConfidenceScenario === 'low';
    const newId = Math.floor(Math.random() * 800) + 100;
    const field = getMockFieldById(options.fieldId);

    const confidence = isLowConfidence ? 0.62 : 0.91;
    const disease = isLowConfidence ? 'Unknown Leaf Spot' : 'Early Blight';
    const routed_to: 'farmer' | 'officer' = confidence >= 0.9 ? 'farmer' : 'officer';
    const status = routed_to === 'farmer' ? 'Disease Detected' : 'pending_review';

    const result: Diagnosis = {
      diagnosis_id: newId,
      field_id: options.fieldId,
      field_name: field?.name || `Field #${options.fieldId}`,
      crop: field?.crop || 'Cotton',
      disease,
      confidence,
      status,
      routed_to,
      image_url:
        options.imageUrl ||
        'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      officer_notes:
        routed_to === 'officer'
          ? 'Auto-triaged to Taluka Agriculture Extension Officer due to low confidence (<90%).'
          : undefined,
    };

    saveMockDiagnosis(result);
    return {
      diagnosis_id: result.diagnosis_id,
      disease: result.disease,
      confidence: result.confidence,
      status: result.status,
      routed_to: result.routed_to,
      field_id: result.field_id,
    };
  }

  const formData = new FormData();
  formData.append('field_id', String(options.fieldId));
  if (options.imageFile) {
    formData.append('image', options.imageFile);
  }

  const response = await apiClient.post<DiagnosisResponse>('/diagnosis/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
  * Alias / Wrapper for createDiagnosis
  */
export const createDiagnosis = async (params: {
  field_id: number;
  image?: string;
  imageFile?: File | Blob;
  scenario?: 'high' | 'low';
}): Promise<DiagnosisResponse> => {
  return submitDiagnosis({
    fieldId: params.field_id,
    imageUrl: typeof params.image === 'string' ? params.image : undefined,
    imageFile: params.imageFile,
    forceConfidenceScenario: params.scenario,
  });
};

/**
 * GET /diagnosis/{id}/
 */
export const getDiagnosisById = async (id: number | string): Promise<Diagnosis> => {
  if (isMockModeEnabled()) {
    const diag = getMockDiagnosisById(Number(id));
    if (!diag) {
      // Return a synthesized mock diagnosis so deep links never 404 in demo
      return {
        diagnosis_id: Number(id),
        field_id: 1,
        field_name: 'Cotton — Field 1',
        crop: 'Cotton',
        disease: 'Early Blight',
        confidence: 0.91,
        status: 'Disease Detected',
        routed_to: 'farmer',
        created_at: new Date().toISOString(),
        image_url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
      };
    }
    return diag;
  }

  const response = await apiClient.get<Diagnosis>(`/diagnosis/${id}/`);
  return response.data;
};

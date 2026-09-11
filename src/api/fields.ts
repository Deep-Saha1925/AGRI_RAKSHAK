import { apiClient, isMockModeEnabled } from './client';
import { getMockFields, getMockFieldById, saveMockField , deleteMockField, } from './mockStore';
import { Field } from '../types';

/**
 * =========================================================================
 * PERSON 3 HOOK: FIELD REGISTRATION PAYLOAD FORMATTER
 * =========================================================================
 * The API contract (v0.2) specifies:
 *   POST /fields/ -> Response: { "field_id": 12, "created_at": "..." }
 * However, the contract does NOT specify the POST /fields/ request body schema.
 *
 * DO NOT INVENT A HARDCODED BACKEND SCHEMA.
 * All frontend field form inputs are marshalled through this single isolated
 * function. When Person 3 specifies the exact database/model schema, simply
 * update this return object to match Person 3's backend expectations.
 * =========================================================================
 */
export interface RawFieldFormData {
  fieldName: string;
  crop: string;
  variety?: string;
  growthStage?: string;
  soilType?: string;
  areaAcres: number | string;
  location: string;
  lat?: number;
  lng?: number;
}

export function formatFieldPayload(formData: RawFieldFormData) {
  // PERSON 3: Customize this payload to match your Prisma/Express schema:
  return {
    name: formData.fieldName,
    crop: formData.crop.toLowerCase(),
    variety: formData.variety || '',
    growth_stage: formData.growthStage || 'vegetative',
    soil_type: formData.soilType || 'black',
    area: Number(formData.areaAcres) || 1,
    location: formData.location,
    lat: formData.lat || 20.93,
    lng: formData.lng || 77.75,
  };
}

export interface CreateFieldResponse {
  field_id: number;
  created_at: string;
}

/**
 * Register a new field.
 * POST /fields/
 */
export const createField = async (formData: RawFieldFormData): Promise<CreateFieldResponse> => {
  const payload = formatFieldPayload(formData);

  if (isMockModeEnabled()) {
    const saved = saveMockField({
      name: formData.fieldName || `${formData.crop} Field`,
      crop: formData.crop,
      variety: formData.variety,
      growth_stage: formData.growthStage,
      soil_type: formData.soilType,
      area_acres: Number(formData.areaAcres) || 1,
      location: formData.location,
      lat: formData.lat || 20.93,
      lng: formData.lng || 77.75,
    });
    return {
      field_id: saved.id,
      created_at: saved.created_at,
    };
  }

  const response = await apiClient.post<CreateFieldResponse>('/fields/', payload);
  return response.data;
};

/**
 * Retrieve list of logged-in farmer's fields.
 * GET /fields/
 */
export const getFields = async (): Promise<Field[]> => {
  if (isMockModeEnabled()) {
    return getMockFields();
  }

  const response = await apiClient.get<Field[]>('/fields/');
  return response.data;
};

/**
 * Retrieve field detail + latest risk + latest diagnosis.
 * GET /fields/{id}/
 */
export const getFieldById = async (id: number | string): Promise<Field> => {
  if (isMockModeEnabled()) {
    const field = getMockFieldById(Number(id));
    if (!field) {
      throw new Error(`Field with ID ${id} not found.`);
    }
    return field;
  }

  const response = await apiClient.get<Field>(`/fields/${id}/`);
  return response.data;
};
/**
 * Delete a field.
 * DELETE /fields/{id}/
 */
export const deleteField = async (id: number | string): Promise<void> => {
  if (isMockModeEnabled()) {
    const deleted = deleteMockField(Number(id));

    if (!deleted) {
      throw new Error(`Field with ID ${id} not found.`);
    }

    return;
  }

  await apiClient.delete(`/fields/${id}/`);
};
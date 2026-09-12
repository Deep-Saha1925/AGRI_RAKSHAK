import { ADVISORY_DB } from "./advisoryData.js";
import prisma from "../prisma/client.js"; 

export async function getAdvisoryByDisease(disease) {
  // Case-insensitive search
  const key = Object.keys(ADVISORY_DB).find(k => k.toLowerCase() === disease.toLowerCase()) || "Early Blight";
  const data = ADVISORY_DB[key];
  return {
    disease: disease,
    crop: data.crop,
    steps: data.steps,
    escalate_if: data.escalate_if,
    followup_days: data.followup_days,
    chemical: data.chemical,
    safety: data.safety
  };
}

export async function scheduleRecheck(diagnosis_id, scheduled_for) {
  return prisma.followUp.create({
    data: {
      diagnosis_id: parseInt(diagnosis_id),
      scheduled_for: new Date(scheduled_for),
      status: "PENDING"
    }
  });
}

export async function submitRecheckResult(id, status, new_diagnosis_id) {
  return prisma.followUp.update({
    where: { id: parseInt(id) },
    data: {
      status: status,
      new_diagnosis_id: new_diagnosis_id? parseInt(new_diagnosis_id) : null,
      completed_at: new Date()
    }
  });
}

// Extra: Merge with common_dataset District|Crop|Season|Area|Production|Yield
export async function getAdvisoryWithDistrict(disease, district, area, yield_prod) {
  const advisory = await getAdvisoryByDisease(disease);
  const production = (parseFloat(area) * parseFloat(yield_prod)).toFixed(2);
  return {
   ...advisory,
    district: district,
    area_hectares: parseFloat(area),
    production_tonnes: parseFloat(production),
    yield_productivity: parseFloat(yield_prod),
    context: `District ${district}: Area ${area} ha, Estimated Production ${production} t, Yield ${yield_prod} t/ha`
  };
}
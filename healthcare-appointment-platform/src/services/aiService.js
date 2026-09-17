import api from "./api.js";

export async function analyzePatient(patientId) {
  const response = await api.post(`/ai/analyze-patient/${patientId}`);
  return response.data.analysis;
}

export async function chatWithPatient(message, history, image) {
  const payload = { message, history };
  if (image) payload.image = image;
  const response = await api.post("/ai/patient/chat", payload);
  return response.data;
}
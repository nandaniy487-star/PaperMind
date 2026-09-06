import axios from 'axios';

export const API_BASE_URL = '/api';

export async function uploadPaper(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${API_BASE_URL}/upload-paper`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

export async function askPaper(question) {
  const response = await axios.post(
    `${API_BASE_URL}/ask-paper`,
    { question }
  );

  return response.data;
}

export async function generateStudyNotes() {
  const response = await axios.post(
    `${API_BASE_URL}/study-notes`
  );

  return response.data;
}
export async function generateMethodology() {
  const response = await axios.post(
    `${API_BASE_URL}/methodology`
  );

  return response.data;
}
export async function generateResultsConclusion() {
  const response = await axios.post(
    `${API_BASE_URL}/results-conclusion`
  );

  return response.data;
}
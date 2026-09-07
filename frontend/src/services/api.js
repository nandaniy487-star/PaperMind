import axios from 'axios';

export const API_BASE_URL = '/api';

// -----------------------------
// Upload Research Paper
// -----------------------------

export async function uploadPaper(file) {
  const formData = new FormData();

  formData.append('file', file);

  const response = await axios.post(
    `${API_BASE_URL}/upload-paper`,
    formData
  );

  return response.data;
}


// -----------------------------
// Chat With Research Paper
// -----------------------------

export async function askPaper(question, paperId) {
  const response = await axios.post(
    `${API_BASE_URL}/ask-paper`,
    {
      question,
      paper_id: paperId,
    }
  );

  return response.data;
}


// -----------------------------
// Generate Study Notes
// -----------------------------

export async function generateStudyNotes(paperId) {
  const response = await axios.post(
    `${API_BASE_URL}/study-notes`,
    {
      paper_id: paperId,
    }
  );

  return response.data;
}


// -----------------------------
// Generate Methodology Analysis
// -----------------------------

export async function generateMethodology(paperId) {
  const response = await axios.post(
    `${API_BASE_URL}/methodology`,
    {
      paper_id: paperId,
    }
  );

  return response.data;
}


// -----------------------------
// Generate Results & Conclusion
// -----------------------------

export async function generateResultsConclusion(paperId) {
  const response = await axios.post(
    `${API_BASE_URL}/results-conclusion`,
    {
      paper_id: paperId,
    }
  );

  return response.data;
}
import axios from 'axios';

export const API_BASE_URL = '/api';

/**
 * Uploads a PDF research paper to the PaperMind FastAPI backend.
 * @param {File} file - The PDF file to be uploaded.
 * @returns {Promise<{filename: string, message: string, chunks_created: number}>}
 */
export async function uploadPaper(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/upload-paper`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

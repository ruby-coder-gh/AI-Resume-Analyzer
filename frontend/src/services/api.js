const API_BASE = '/api';

export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Analysis failed (${response.status})`);
  }

  return data.data;
}

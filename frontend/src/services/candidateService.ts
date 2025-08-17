import axiosInstance from './axiosInstance';

export const addCandidate = async (candidateData: Record<string, any>) => {
  try {
    const response = await axiosInstance.post('/api/v1/candidates', candidateData);
    return response.data;
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

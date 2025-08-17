import axiosInstance from './axiosInstance';

export interface CandidateResponse {
  id: string;
  // Add other fields if necessary
}

export const addCandidate = async (candidateData: Record<string, any>): Promise<CandidateResponse> => {
  try {
    const response = await axiosInstance.post<CandidateResponse>('/api/v1/candidates', candidateData);
    return response.data;
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

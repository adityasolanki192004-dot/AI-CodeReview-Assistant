import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const analyzeRepo = async (repoUrl: string) => {
  const response = await axios.post(`${API_URL}/analyze/`, {
    repo_url: repoUrl,
  });
  return response.data;
};

export const analyzePR = async (prUrl: string) => {
  const response = await axios.post(`${API_URL}/analyze-pr`, {
    pr_url: prUrl,
  });
  return response.data;
};
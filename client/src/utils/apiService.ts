import axios, { AxiosInstance } from "axios";
import { apiConfig } from "../config/apiConfig";

const apiService: AxiosInstance = axios.create({
  baseURL: apiConfig.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete apiService.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default apiService;

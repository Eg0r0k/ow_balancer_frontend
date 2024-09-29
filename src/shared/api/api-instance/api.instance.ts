import axios from "axios";

export const INSTANCE_TIMEOUT = 3000;

export const INSTANCE_HEADER = {
  "Content-Type": "application/json",
};

export const authInstance = axios.create({
  timeout: INSTANCE_TIMEOUT,
  headers: INSTANCE_HEADER,
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

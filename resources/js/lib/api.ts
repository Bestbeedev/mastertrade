import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: (import.meta.env as { VITE_API_BASE_URL?: string })?.VITE_API_BASE_URL || "/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Erreur réseau";
    toast.error(msg);
    return Promise.reject(err);
  }
);

export const get = api.get.bind(api);
export const post = api.post.bind(api);
export const put = api.put.bind(api);
export const del = api.delete.bind(api);

export default api;

const IS_LOCALHOST = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE = import.meta.env.VITE_API_BASE_URL ||
  (IS_LOCALHOST ? `http://${window.location.hostname}:5000/api` : `${window.location.origin}/api`);

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${url}`, { ...options, headers: getHeaders() });
  } catch (err) {
    throw new Error(
      "Cannot connect to server. Make sure the backend is running and set VITE_API_BASE_URL if the API is on a different host."
    );
  }

  // Check if response is JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response. Backend may not be running.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const authAPI = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  google: (body) => request("/auth/google", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: (body) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
};

export const pollAPI = {
  create: (body) => request("/polls", { method: "POST", body: JSON.stringify(body) }),
  getMyPolls: () => request("/polls/my"),
  getByLink: (link) => request(`/polls/link/${link}`),
  publish: (id) => request(`/polls/${id}/publish`, { method: "PATCH" }),
  toggle: (id) => request(`/polls/${id}/toggle`, { method: "PATCH" }),
};

export const responseAPI = {
  submit: (body) => request("/responses", { method: "POST", body: JSON.stringify(body) }),
  progress: (body) => request("/responses/progress", { method: "POST", body: JSON.stringify(body) }),
  checkStatus: (pollId) => request(`/responses/check/${pollId}`),
  analytics: (pollId) => request(`/responses/analytics/${pollId}`),
  publicResults: (link) => request(`/responses/results/${link}`),
};

export const templateAPI = {
  getAll: () => request("/templates"),
  get: (id) => request(`/templates/${id}`),
  create: (body) => request("/templates", { method: "POST", body: JSON.stringify(body) }),
  delete: (id) => request(`/templates/${id}`, { method: "DELETE" }),
};

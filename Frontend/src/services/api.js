const API_BASE = `http://${window.location.hostname}:5000/api`;

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
    throw new Error("Cannot connect to server. Make sure backend is running on port 5000.");
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

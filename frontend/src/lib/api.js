import { API_BASE } from "../config";

/**
 * @typedef {"LANDLORD"|"TENANT"|"ADMIN"} UserRole
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {UserRole} role
 * @property {string=} phone
 * @property {string=} timezone
 * @property {string=} bio
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access
 * @property {string} refresh
 * @property {User} user
 */

/**
 * @template T
 * @param {string} path
 * @param {RequestInit=} opts
 * @returns {Promise<T>}
 */
async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return await res.json();
}

export const api = {
  /** @param {{username:string,email?:string,password:string,first_name?:string,last_name?:string,role?:"TENANT"|"LANDLORD"}} payload */
  register: (payload) => request(`/api/auth/register/`, { method: "POST", body: JSON.stringify(payload) }),

  /** @param {{username:string,password:string}} payload */
  login: (payload) => request(`/api/auth/login/`, { method: "POST", body: JSON.stringify(payload) }),

  /** @param {string} accessToken */
  me: (accessToken) =>
    request(`/api/auth/me/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /**
   * @param {string} accessToken
   * @param {{first_name?:string,last_name?:string,phone?:string,timezone?:string,bio?:string}} payload
   */
  updateMe: (accessToken, payload) =>
    request(`/api/auth/me/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {{current_password:string,new_password:string}} payload */
  changePassword: (accessToken, payload) =>
    request(`/api/auth/change-password/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
};

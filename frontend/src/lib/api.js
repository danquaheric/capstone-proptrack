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
  const headers = new Headers(opts.headers || {});

  // Only set JSON content-type when we actually send a non-FormData body.
  // If no content-type is set and body is a string, some browsers default to text/plain.
  if (opts.body && !(opts.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
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

  /** @param {string} refreshToken */
  refresh: (refreshToken) => request(`/api/auth/token/refresh/`, { method: "POST", body: JSON.stringify({ refresh: refreshToken }) }),

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

  /** @param {string} accessToken */
  listProperties: (accessToken) =>
    request(`/api/properties/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /**
   * @param {string} accessToken
   * @param {{name:string,street_address:string,city?:string,state?:string,zip_code?:string,units?:number,monthly_rent?:number|string,status?:string}} payload
   */
  createProperty: (accessToken, payload) =>
    request(`/api/properties/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {number|string} id */
  getProperty: (accessToken, id) =>
    request(`/api/properties/${id}/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken @param {number|string} id */
  listPropertyPhotos: (accessToken, id) =>
    request(`/api/properties/${id}/photos/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken @param {number|string} id @param {File} file @param {{caption?:string, sort_order?:number}=} meta */
  uploadPropertyPhoto: async (accessToken, id, file, meta = {}) => {
    const form = new FormData();
    form.append("image", file);
    if (meta.caption) form.append("caption", meta.caption);
    if (typeof meta.sort_order === "number") form.append("sort_order", String(meta.sort_order));

    const res = await fetch(`${API_BASE}/api/properties/${id}/photos/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Upload failed: ${res.status}`);
    }

    return await res.json();
  },

  /** @param {string} accessToken @param {number|string} id @param {number|string} photoId */
  deletePropertyPhoto: async (accessToken, id, photoId) => {
    const res = await fetch(`${API_BASE}/api/properties/${id}/photos/${photoId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Delete failed: ${res.status}`);
    }

    return true;
  },

  /**
   * @param {string} accessToken
   * @param {number|string} id
   * @param {{name?:string,street_address?:string,city?:string,state?:string,zip_code?:string,units?:number,monthly_rent?:number|string,status?:string}} payload
   */
  updateProperty: (accessToken, id, payload) =>
    request(`/api/properties/${id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {number|string} id @param {{tenant_id:number|null}} payload */
  assignTenant: (accessToken, id, payload) =>
    request(`/api/properties/${id}/assign-tenant/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {string=} q */
  listTenants: (accessToken, q = "") =>
    request(`/api/users/tenants/${q ? `?q=${encodeURIComponent(q)}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    ),

  /**
   * @param {string} accessToken
   * @param {{status?:"PAID"|"UNPAID"|"OVERDUE", q?:string}} params
   */
  listRentPayments: (accessToken, params = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.q) q.set("q", params.q);
    const suffix = q.toString() ? `?${q.toString()}` : "";
    return request(`/api/rent-payments/${suffix}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  /** @param {string} accessToken */
  tenantRentStatus: (accessToken) =>
    request(`/api/tenants/me/rent-status/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /**
   * @param {string} accessToken
   * @param {{rental_property:number, tenant:number, amount:number|string, due_date:string, paid_at?:string|null}} payload
   */
  createRentPayment: (accessToken, payload) =>
    request(`/api/rent-payments/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {number|string} id @param {object} payload */
  updateRentPayment: (accessToken, id, payload) =>
    request(`/api/rent-payments/${id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  // Maintenance
  /** @param {string} accessToken @param {{status?:string,q?:string}=} params */
  listMaintenance: (accessToken, params = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.q) q.set("q", params.q);
    const suffix = q.toString() ? `?${q.toString()}` : "";
    return request(`/api/maintenance/${suffix}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  /** @param {string} accessToken @param {{rental_property:number,category:string,priority:string,title?:string,description:string}} payload */
  createMaintenance: (accessToken, payload) =>
    request(`/api/maintenance/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  /** @param {string} accessToken @param {number|string} id @param {{status:string}} payload */
  updateMaintenanceStatus: (accessToken, id, payload) =>
    request(`/api/maintenance/${id}/status/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),

  // Notifications
  /** @param {string} accessToken */
  listNotifications: (accessToken) =>
    request(`/api/notifications/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken @param {number|string} id */
  markNotificationRead: (accessToken, id) =>
    request(`/api/notifications/${id}/read/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken */
  readAllNotifications: (accessToken) =>
    request(`/api/notifications/read-all/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken */
  getNotificationPreferences: (accessToken) =>
    request(`/api/notification-preferences/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** @param {string} accessToken @param {object} payload */
  updateNotificationPreferences: (accessToken, payload) =>
    request(`/api/notification-preferences/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
};

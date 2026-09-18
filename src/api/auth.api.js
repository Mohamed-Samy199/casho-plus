import httpClient from "./httpClient";

// ── Public ────────────────────────────────────────────────────
export const login = (phone, password) =>
  httpClient.post("/auth/login", { phone, password }).then((res) => res.data.data);

// ── Protected ─────────────────────────────────────────────────
export const getMe = () => httpClient.get("/auth/me").then((res) => res.data.data.user);

export const changePassword = (currentPassword, newPassword, newPasswordConfirm) =>
  httpClient
    .patch("/auth/change-password", { currentPassword, newPassword, newPasswordConfirm })
    .then((res) => res.data.data);

// ── Admin only ────────────────────────────────────────────────
export const createUser = (data) =>
  httpClient.post("/auth/users", data).then((res) => res.data.data.user);

export const listUsers = () => httpClient.get("/auth/users").then((res) => res.data.data);

export const changeUserRole = (userId, role) =>
  httpClient.patch(`/auth/users/${userId}/role`, { role }).then((res) => res.data.data.user);

export const addUserPhoneNumber = (userId, phone) =>
  httpClient.post(`/auth/users/${userId}/phones`, { phone }).then((res) => res.data.data.user);

export const removeUserPhoneNumber = (userId, phone) =>
  httpClient.delete(`/auth/users/${userId}/phones/${phone}`).then((res) => res.data.data.user);
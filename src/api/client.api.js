import httpClient from "./httpClient";

export const listClients = (params) =>
  httpClient.get("/clients", { params }).then((res) => res.data.data);

export const getClient = (id) => httpClient.get(`/clients/${id}`).then((res) => res.data.data);

export const createClient = (data) =>
  httpClient.post("/clients", data).then((res) => res.data.data);

export const updateClient = (id, data) =>
  httpClient.patch(`/clients/${id}`, data).then((res) => res.data.data);

export const addClientPhoneNumber = (id, phone) =>
  httpClient.post(`/clients/${id}/phones`, { phone }).then((res) => res.data.data);

export const removeClientPhoneNumber = (id, phone) =>
  httpClient.delete(`/clients/${id}/phones/${phone}`).then((res) => res.data.data);
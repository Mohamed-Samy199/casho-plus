import httpClient from "./httpClient";

export const listPartners = (params) =>
  httpClient.get("/partners", { params }).then((res) => res.data.data);

export const getPartnerDetails = (id) =>
  httpClient.get(`/partners/${id}`).then((res) => res.data.data);

export const createPartner = (data) =>
  httpClient.post("/partners", data).then((res) => res.data.data);

export const updatePartner = (id, data) =>
  httpClient.patch(`/partners/${id}`, data).then((res) => res.data.data);

export const createPartnerAccount = (id, password) =>
  httpClient.post(`/partners/${id}/account`, { password }).then((res) => res.data.data);

export const addPartnerPhoneNumber = (id, phone) =>
  httpClient.post(`/partners/${id}/phones`, { phone }).then((res) => res.data.data);

export const removePartnerPhoneNumber = (id, phone) =>
  httpClient.delete(`/partners/${id}/phones/${phone}`).then((res) => res.data.data);

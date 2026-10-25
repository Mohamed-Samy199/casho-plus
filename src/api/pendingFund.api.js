import httpClient from "./httpClient";

export const listPendingFunds = (params = {}) => httpClient.get("/pending-funds", { params }).then((res) => res.data.data);
export const createPendingFund = (data) => httpClient.post("/pending-funds", data).then((res) => res.data.data);
export const returnPendingFund = (id, data) => httpClient.patch(`/pending-funds/${id}/return`, data).then((res) => res.data.data);
export const writeOffPendingFund = (id, data) => httpClient.patch(`/pending-funds/${id}/write-off`, data).then((res) => res.data.data);

import httpClient from "./httpClient";

export const listTransactions = (params) =>
  httpClient.get("/transactions", { params }).then((res) => res.data.data);

export const createTransaction = (data) =>
  httpClient.post("/transactions", data).then((res) => res.data.data);

export const getTransaction = (id) =>
  httpClient.get(`/transactions/${id}`).then((res) => res.data.data);
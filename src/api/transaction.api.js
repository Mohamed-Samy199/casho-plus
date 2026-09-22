import httpClient from "./httpClient";

export const listTransactions = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
  return httpClient.get("/transactions", { params: cleanParams }).then((res) => res.data.data);
};

export const createTransaction = (data) =>
  httpClient.post("/transactions", data).then((res) => res.data.data);

export const getTransaction = (id) =>
  httpClient.get(`/transactions/${id}`).then((res) => res.data.data);

export const settleTransaction = (id, amount) =>
  httpClient.patch(`/transactions/${id}/settle`, { amount }).then((res) => res.data.data);

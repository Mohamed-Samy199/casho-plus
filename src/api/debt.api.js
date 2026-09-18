import httpClient from "./httpClient";

export const listDebts = (params) =>
  httpClient.get("/debts", { params }).then((res) => res.data.data);

export const getDebt = (id) => httpClient.get(`/debts/${id}`).then((res) => res.data.data);

export const createDebt = (data) =>
  httpClient.post("/debts", data).then((res) => res.data.data);

export const repayDebt = (id, data) =>
  httpClient.post(`/debts/${id}/repay`, data).then((res) => res.data.data);

export const listDebtPayments = (id) =>
  httpClient.get(`/debts/${id}/payments`).then((res) => res.data.data);

export const uploadReceipts = (id, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return httpClient
    .post(`/debts/${id}/receipts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.data);
};
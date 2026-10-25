import httpClient from "./httpClient";

export const listExpenseAccounts = () =>
  httpClient.get("/expenses/accounts").then((res) => res.data.data);

export const listExpenses = (params = {}) =>
  httpClient.get("/expenses", { params }).then((res) => res.data.data);

export const createExpense = (data) =>
  httpClient.post("/expenses", data).then((res) => res.data.data);

export const repayAdvance = (id, data) =>
  httpClient.patch(`/expenses/${id}/repay`, data).then((res) => res.data.data);

export const sellAsset = (id, data) =>
  httpClient.patch(`/expenses/${id}/sell`, data).then((res) => res.data.data);

import httpClient from "./httpClient";

export const listAccounts = () =>
  httpClient.get("/internal-transfers/accounts").then((res) => res.data.data);
export const listTransfers = (params) =>
  httpClient.get("/internal-transfers", { params }).then((res) => res.data.data);
export const createTransfer = (data) =>
  httpClient.post("/internal-transfers", data).then((res) => res.data.data);

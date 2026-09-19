import httpClient from "./httpClient";

export const getCapitalSummary = ( ) =>
  httpClient.get("/capital/summary" ).then((res) => res.data.data);

export const getCapitalByPartner = () =>
  httpClient.get("/capital/by-partner" ).then((res) => res.data.data);

export const adjustBalance = (data) =>
  httpClient.post("/capital/balance-adjustments", data ).then((res) => res.data.data);

export const getBalanceHistory = (params) =>
  httpClient.get("/capital/balance-history", { params } ).then((res) => res.data.data);
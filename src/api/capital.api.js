import httpClient from "./httpClient";

export const getCapitalSummary = () =>
  httpClient.get("/capital/summary").then((res) => res.data.data);

export const getCapitalByPartner = () =>
  httpClient.get("/capital/by-partner").then((res) => res.data.data);
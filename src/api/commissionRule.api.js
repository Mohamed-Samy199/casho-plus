import httpClient from "./httpClient";

export const listCommissionRules = (params) =>
  httpClient.get("/commission-rules", { params }).then((res) => res.data.data);

export const upsertCommissionRule = (data) =>
  httpClient.put("/commission-rules", data).then((res) => res.data.data);
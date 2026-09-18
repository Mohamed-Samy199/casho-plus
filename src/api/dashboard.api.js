import httpClient from "./httpClient";

export const getDashboard = () => httpClient.get("/dashboard").then((res) => res.data.data);
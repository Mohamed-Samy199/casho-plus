import httpClient from "./httpClient";

export const checkIn = () => httpClient.post("/attendance/check-in").then((res) => res.data.data);

export const checkOut = () =>
  httpClient.post("/attendance/check-out").then((res) => res.data.data);

export const getTodayStatus = () =>
  httpClient.get("/attendance/today").then((res) => res.data.data);

export const listAttendance = (params) =>
  httpClient.get("/attendance", { params }).then((res) => res.data.data);

export const adminUpsertAttendance = (data) =>
  httpClient.put("/attendance/manual", data).then((res) => res.data.data);

export const getMonthlyReport = (year, month) =>
  httpClient
    .get("/attendance/monthly-report", { params: { year, month } })
    .then((res) => res.data.data);
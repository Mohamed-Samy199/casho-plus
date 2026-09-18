import httpClient from "./httpClient";

export const listNotifications = () =>
  httpClient.get("/notifications").then((res) => res.data.data);

export const markAsRead = (id) =>
  httpClient.patch(`/notifications/${id}/read`).then((res) => res.data.data);

export const markAllAsRead = () =>
  httpClient.patch("/notifications/read-all").then((res) => res.data.data);
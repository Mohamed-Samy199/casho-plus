import httpClient from "./httpClient";

export const listTransactions = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
  return httpClient.get("/transactions", { params: cleanParams }).then((res) => res.data.data);
};

export const createTransaction = (data, idempotencyKey) =>
  httpClient
    .post("/transactions", data, { headers: { "Idempotency-Key": idempotencyKey } })
    .then((res) => res.data.data);

export const getTransaction = (id) =>
  httpClient.get(`/transactions/${id}`).then((res) => res.data.data);

export const settleTransaction = (id, amount, idempotencyKey) =>
  httpClient
    .patch(
      `/transactions/${id}/settle`,
      { amount },
      { headers: { "Idempotency-Key": idempotencyKey } }
    )
    .then((res) => res.data.data);

export const reverseTransaction = (id, reason, idempotencyKey) =>
  httpClient
    .post(
      `/transactions/${id}/reverse`,
      { reason },
      { headers: { "Idempotency-Key": idempotencyKey } }
    )
    .then((res) => res.data.data);

export const correctTransaction = (id, targetStage, reason, idempotencyKey) =>
  httpClient
    .post(
      `/transactions/${id}/correct`,
      { targetStage, reason },
      { headers: { "Idempotency-Key": idempotencyKey } }
    )
    .then((res) => res.data.data);

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

export const settleTransaction = (id, dataOrAmount, keyOrIdempotency, legacyIdempotency) => {
  const isNewSignature = dataOrAmount && typeof dataOrAmount === "object";
  const data = isNewSignature ? { ...dataOrAmount } : { amount: dataOrAmount };
  const idempotencyKey = isNewSignature ? keyOrIdempotency : legacyIdempotency || keyOrIdempotency;

  // حماية من النسخة القديمة التي كانت تضع object داخل amount.
  if (data.amount && typeof data.amount === "object") data.amount = data.amount.amount;
  if (data.commission && typeof data.commission === "object") data.commission = data.commission.amount;

  return httpClient
    .patch(`/transactions/${id}/settle`, data, {
      headers: { "Idempotency-Key": idempotencyKey },
    })
    .then((res) => res.data.data);
};

export const reverseTransaction = (id, reason, idempotencyKey) =>
  httpClient
    .post(
      `/transactions/${id}/reverse`,
      { reason },
      { headers: { "Idempotency-Key": idempotencyKey } }
    )
    .then((res) => res.data.data);

export const correctTransaction = (id, dataOrTargetStage, reasonOrKey, legacyKey) => {
  const isNewSignature = dataOrTargetStage && typeof dataOrTargetStage === "object";
  const data = isNewSignature
    ? dataOrTargetStage
    : { targetStage: String(dataOrTargetStage || ""), reason: reasonOrKey || "" };
  const idempotencyKey = isNewSignature ? reasonOrKey : legacyKey;

  // حماية إضافية: لا تسمح بإرسال object كقيمة للمرحلة.
  if (data.targetStage !== undefined) {
    const rawStage = data.targetStage;
    data.targetStage = typeof rawStage === "string"
      ? rawStage
      : rawStage?.value || rawStage?.target?.value || "";
  }

  return httpClient
    .post(`/transactions/${id}/correct`, data, {
      headers: { "Idempotency-Key": idempotencyKey },
    })
    .then((res) => res.data.data);
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";

export function useSettleTransaction(transactionId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, idempotencyKey }) => {
      const isLegacySafePayment = data?.paymentMethod === "liquidity" && Number(data?.commission || 0) === 0;
      return isLegacySafePayment
        ? transactionApi.settleTransaction(transactionId, Number(data.amount), idempotencyKey)
        : transactionApi.settleTransaction(transactionId, data, idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["capital-summary"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCorrectTransaction(transactionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, idempotencyKey }) =>
      transactionApi.correctTransaction(transactionId, data, idempotencyKey),
    onSuccess: (result) => {
      const updated = result?.transaction;
      if (updated?._id) {
        queryClient.setQueriesData({ queryKey: ["transactions"] }, (current) => {
          if (!current) return current;
          if (Array.isArray(current)) {
            return current.map((item) => item._id === updated._id ? updated : item);
          }
          if (Array.isArray(current.result)) {
            return { ...current, result: current.result.map((item) => item._id === updated._id ? updated : item) };
          }
          return current;
        });
      }
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_BY_PARTNER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL_HISTORY });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

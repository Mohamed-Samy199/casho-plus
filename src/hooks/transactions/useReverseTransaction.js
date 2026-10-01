import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useReverseTransaction(transactionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reason, idempotencyKey }) =>
      transactionApi.reverseTransaction(transactionId, reason, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_BY_PARTNER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL_HISTORY });
    },
  });
}

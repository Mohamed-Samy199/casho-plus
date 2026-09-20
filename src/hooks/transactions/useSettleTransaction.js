import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";

export function useSettleTransaction(transactionId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount) => transactionApi.settleTransaction(transactionId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

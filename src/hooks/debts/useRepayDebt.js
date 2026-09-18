import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as debtApi from "../../api/debt.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useRepayDebt(debtId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => debtApi.repayDebt(debtId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEBT_PAYMENTS(debtId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
    },
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useDailyReconciliation(date) {
  return useQuery({
    queryKey: QUERY_KEYS.DAILY_RECONCILIATION(date),
    queryFn: () => capitalApi.getDailyReconciliation(date),
    enabled: Boolean(date),
  });
}

export function useCloseDailyReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: capitalApi.closeDailyReconciliation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DAILY_RECONCILIATION(variables.date) });
      queryClient.invalidateQueries({ queryKey: ["capital", "reconciliation-history"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_HISTORY });
    },
  });
}

export function useDailyReconciliationHistory(params) {
  return useQuery({
    queryKey: ["capital", "reconciliation-history", params],
    queryFn: () => capitalApi.listDailyReconciliations(params),
  });
}

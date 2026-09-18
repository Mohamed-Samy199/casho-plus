import { useQuery } from "@tanstack/react-query";
import * as debtApi from "../../api/debt.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useDebtPayments(debtId) {
  return useQuery({
    queryKey: QUERY_KEYS.DEBT_PAYMENTS(debtId),
    queryFn: () => debtApi.listDebtPayments(debtId),
    enabled: !!debtId,
  });
}
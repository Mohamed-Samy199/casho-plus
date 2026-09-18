import { useQuery } from "@tanstack/react-query";
import * as debtApi from "../../api/debt.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useDebts(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.DEBTS(filters),
    queryFn: () => debtApi.listDebts(filters),
  });
}
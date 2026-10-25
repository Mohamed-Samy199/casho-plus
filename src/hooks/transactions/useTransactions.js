import { useQuery } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useTransactions(filters = {}) {
  const { enabled = true, ...queryFilters } = filters;
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS(queryFilters),
    queryFn: () => transactionApi.listTransactions(queryFilters),
    enabled,
  });
}

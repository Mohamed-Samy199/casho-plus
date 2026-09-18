import { useQuery } from "@tanstack/react-query";
import * as transactionApi from "../../api/transaction.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useTransactions(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS(filters),
    queryFn: () => transactionApi.listTransactions(filters),
  });
}
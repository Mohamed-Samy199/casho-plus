import { useQuery } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useMyCapital() {
  return useQuery({
    queryKey: QUERY_KEYS.MY_CAPITAL,
    queryFn: capitalApi.getMyCapital,
  });
}

export function useMyBalanceHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.MY_CAPITAL_HISTORY,
    queryFn: () => capitalApi.getMyBalanceHistory(),
  });
}
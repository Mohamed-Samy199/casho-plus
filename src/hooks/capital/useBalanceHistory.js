import { useQuery } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useBalanceHistory(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.CAPITAL_HISTORY(params),
    queryFn: () => capitalApi.getBalanceHistory(params),
  });
}
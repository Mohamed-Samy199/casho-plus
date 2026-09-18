import { useQuery } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCapitalByPartner() {
  return useQuery({
    queryKey: QUERY_KEYS.CAPITAL_BY_PARTNER,
    queryFn: capitalApi.getCapitalByPartner,
  });
}
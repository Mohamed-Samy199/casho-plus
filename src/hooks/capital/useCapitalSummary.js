import { useQuery } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCapitalSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.CAPITAL_SUMMARY,
    queryFn: capitalApi.getCapitalSummary,
  });
}
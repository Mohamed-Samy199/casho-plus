import { useQuery } from "@tanstack/react-query";
import * as partnerApi from "../../api/partner.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function usePartners(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PARTNERS, params],
    queryFn: () => partnerApi.listPartners(params),
  });
}
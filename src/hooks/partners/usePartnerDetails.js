import { useQuery } from "@tanstack/react-query";
import * as partnerApi from "../../api/partner.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function usePartnerDetails(id) {
  return useQuery({
    queryKey: QUERY_KEYS.PARTNER(id),
    queryFn: () => partnerApi.getPartnerDetails(id),
    enabled: !!id,
  });
}
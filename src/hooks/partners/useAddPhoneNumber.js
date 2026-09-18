import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as partnerApi from "../../api/partner.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useAddPhoneNumber(partnerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phone) => partnerApi.addPartnerPhoneNumber(partnerId, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNER(partnerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
    },
  });
}

export function useRemovePhoneNumber(partnerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phone) => partnerApi.removePartnerPhoneNumber(partnerId, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNER(partnerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
    },
  });
}
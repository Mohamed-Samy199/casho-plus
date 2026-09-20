import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as partnerApi from "../../api/partner.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCreatePartnerAccount(partnerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password) => partnerApi.createPartnerAccount(partnerId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNER(partnerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

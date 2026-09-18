import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as partnerApi from "../../api/partner.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: partnerApi.createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
    },
  });
}
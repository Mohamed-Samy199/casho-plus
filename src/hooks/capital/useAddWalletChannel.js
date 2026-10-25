import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useAddWalletChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: capitalApi.addWalletChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_BY_PARTNER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL });
    },
  });
}

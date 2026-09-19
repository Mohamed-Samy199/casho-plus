import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useAdjustMyBalance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: capitalApi.adjustMyBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL_HISTORY });
    },
  });
}
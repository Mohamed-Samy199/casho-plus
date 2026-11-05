import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useAddWalletChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: capitalApi.addWalletChannel,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_SUMMARY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAPITAL_BY_PARTNER });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_CAPITAL });

      // تحديث قائمة الشركاء وتفاصيل الشريك فور إضافة القناة
      // بدلًا من انتظار عمل Refresh للمتصفح.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });

      if (variables?.ownerType === "Partner" && variables?.ownerId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PARTNER(variables.ownerId),
        });
      }
    },
  });
}

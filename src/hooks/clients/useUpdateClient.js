import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientApi from "../../api/client.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useUpdateClient(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT(id) });
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientApi from "../../api/client.api";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as debtApi from "../../api/debt.api";

export function useCreateDebt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: debtApi.createDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
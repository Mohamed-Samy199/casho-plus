import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as debtApi from "../../api/debt.api";

export function useUploadReceipts(debtId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files) => debtApi.uploadReceipts(debtId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
}
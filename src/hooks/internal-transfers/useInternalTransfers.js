import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/internalTransfer.api";

const ACCOUNTS_KEY = ["internal-transfers", "accounts"];
const TRANSFERS_KEY = ["internal-transfers"];

export function useTransferAccounts() {
  return useQuery({ queryKey: ACCOUNTS_KEY, queryFn: api.listAccounts });
}
export function useTransfers(params = {}) {
  return useQuery({ queryKey: [...TRANSFERS_KEY, params], queryFn: () => api.listTransfers(params) });
}
export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSFERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["capital"] });
    },
  });
}

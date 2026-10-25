import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/pendingFund.api";

const KEY = ["pending-funds"];
const ACCOUNTS_KEY = ["expenses", "accounts"];

function usePendingMutation(mutationFn) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
            queryClient.invalidateQueries({ queryKey: ["capital"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}

export function usePendingFunds(params = {}) { return useQuery({ queryKey: [...KEY, params], queryFn: () => api.listPendingFunds(params) }); }
export function useCreatePendingFund() { return usePendingMutation(api.createPendingFund); }
export function useReturnPendingFund() { return usePendingMutation(({ id, data }) => api.returnPendingFund(id, data)); }
export function useWriteOffPendingFund() { return usePendingMutation(({ id, data }) => api.writeOffPendingFund(id, data)); }

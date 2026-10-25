import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/expense.api";

const EXPENSES_KEY = ["expenses"];
const ACCOUNTS_KEY = ["expenses", "accounts"];

export function useExpenseAccounts() {
  return useQuery({ queryKey: ACCOUNTS_KEY, queryFn: api.listExpenseAccounts });
}

export function useExpenses(params = {}) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, params],
    queryFn: () => api.listExpenses(params),
  });
}

function useExpenseMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["capital"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateExpense() {
  return useExpenseMutation(api.createExpense);
}

export function useRepayAdvance() {
  return useExpenseMutation(({ id, data }) => api.repayAdvance(id, data));
}

export function useSellAsset() {
  return useExpenseMutation(({ id, data }) => api.sellAsset(id, data));
}

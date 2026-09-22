import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commissionRuleApi from "../../api/commissionRule.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useCommissionRules(params, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMMISSION_RULES, params],
    queryFn: () => commissionRuleApi.listCommissionRules(params),
    enabled: options.enabled ?? true,
  });
}

export function useUpsertCommissionRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commissionRuleApi.upsertCommissionRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMISSION_RULES });
    },
  });
}

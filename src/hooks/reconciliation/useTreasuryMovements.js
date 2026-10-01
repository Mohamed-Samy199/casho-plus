import { useQuery } from "@tanstack/react-query";
import * as capitalApi from "../../api/capital.api";

export function useTreasuryMovements(params) {
  return useQuery({
    queryKey: ["capital", "treasury-movements", params],
    queryFn: () => capitalApi.getTreasuryMovements(params),
    enabled: Boolean(params?.from && params?.to),
  });
}

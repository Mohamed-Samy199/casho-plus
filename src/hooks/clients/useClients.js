import { useQuery } from "@tanstack/react-query";
import * as clientApi from "../../api/client.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useClients(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENTS(filters),
    queryFn: () => clientApi.listClients(filters),
  });
}
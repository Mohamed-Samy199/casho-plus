import { useQuery } from "@tanstack/react-query";
import * as clientApi from "../../api/client.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useClient(id) {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT(id),
    queryFn: () => clientApi.getClient(id),
    enabled: !!id,
  });
}
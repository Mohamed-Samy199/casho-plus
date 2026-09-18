
import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../../api/dashboard.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: dashboardApi.getDashboard,
    refetchInterval: 60 * 1000, // تحديث كل دقيقة عشان الأرقام تفضل حديثة
  });
}
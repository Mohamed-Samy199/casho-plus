import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "../../api/attendance.api";

const TODAY_KEY = ["attendance", "today"];
const LIST_KEY = (filters) => ["attendance", "list", filters];
const REPORT_KEY = (year, month) => ["attendance", "monthly-report", year, month];

export function useTodayStatus() {
  return useQuery({
    queryKey: TODAY_KEY,
    queryFn: attendanceApi.getTodayStatus,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODAY_KEY });
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODAY_KEY });
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
  });
}

export function useAttendanceList(filters = {}) {
  return useQuery({
    queryKey: LIST_KEY(filters),
    queryFn: () => attendanceApi.listAttendance(filters),
  });
}

export function useMonthlyReport(year, month) {
  return useQuery({
    queryKey: REPORT_KEY(year, month),
    queryFn: () => attendanceApi.getMonthlyReport(year, month),
    enabled: !!year && !!month,
  });
}

export function useAdminUpsertAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.adminUpsertAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
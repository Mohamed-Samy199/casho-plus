import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../../api/auth.api";

const USERS_KEY = ["users"];

export function useUsers(options = {}) {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: authApi.listUsers,
    enabled: options.enabled ?? true,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) => authApi.changeUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useAddUserPhoneNumber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, phone }) => authApi.addUserPhoneNumber(userId, phone),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useRemoveUserPhoneNumber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, phone }) => authApi.removeUserPhoneNumber(userId, phone),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

import { useMutation } from "@tanstack/react-query";
import * as authApi from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

function updateStoredUser(user) {
  useAuthStore.getState().updateUser(user);
}

export function useAddMyPhoneNumber() {
  return useMutation({
    mutationFn: authApi.addMyPhoneNumber,
    onSuccess: updateStoredUser,
  });
}

export function useRemoveMyPhoneNumber() {
  return useMutation({
    mutationFn: authApi.removeMyPhoneNumber,
    onSuccess: updateStoredUser,
  });
}

import { useMutation } from "@tanstack/react-query";
import * as authApi from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export function useChangePassword() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ currentPassword, newPassword, newPasswordConfirm }) =>
      authApi.changePassword(currentPassword, newPassword, newPasswordConfirm),
    onSuccess: ({ token }) => {
      // كلمة المرور اتغيرت، بيرجع token جديد لازم نحدثه
      setAuth({ user, token });
    },
  });
}
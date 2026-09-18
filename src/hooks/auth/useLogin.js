import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (phone, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await authApi.login(phone, password);
      setAuth({ user, token });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
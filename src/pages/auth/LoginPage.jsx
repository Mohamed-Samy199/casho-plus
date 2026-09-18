import { useState } from "react";
import { useLogin } from "../../hooks/auth/useLogin";
import Input from "../../components/ui/Input";
import SubmitButton from "../../components/ui/SubmitButton";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(phone, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block h-1 w-10 rounded-full bg-accent" />
          <h1 className="mt-4 text-2xl font-black text-casho-yellow">كاشو بلس</h1>
          <p className="mt-1 text-sm text-text-secondary">تسجيل الدخول لنظام إدارة المكتب</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-bg-surface p-6"
        >
          <div className="space-y-4">
            <Input
              label="رقم التلفون"
              type="tel"
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <SubmitButton isLoading={isLoading} className="mt-6">
            دخول
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
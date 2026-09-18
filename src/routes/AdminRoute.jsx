import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROLES } from "../constants/roles";

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
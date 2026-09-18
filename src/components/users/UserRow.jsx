import { useAuthStore } from "../../store/auth.store";
import { useChangeUserRole } from "../../hooks/users/useUsers";
import { ROLES, ROLE_LABELS } from "../../constants/roles";

export default function UserRow({ user }) {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { mutate: changeRole } = useChangeUserRole();
  const isSelf = user._id === currentUserId;

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 font-medium">{user.name}</td>
      <td className="px-4 py-3 text-text-secondary">
        {user.phoneNumbers?.join("، ") || "—"}
      </td>
      <td className="px-4 py-3 text-text-secondary">{user.email || "—"}</td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="text-text-secondary">{ROLE_LABELS[user.role]} (أنت)</span>
        ) : (
          <select
            value={user.role}
            onChange={(e) => changeRole({ userId: user._id, role: e.target.value })}
            className="rounded-lg border border-border bg-bg-raised px-2 py-1 text-sm"
          >
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            user.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
          }`}
        >
          {user.isActive ? "نشط" : "غير نشط"}
        </span>
      </td>
    </tr>
  );
}
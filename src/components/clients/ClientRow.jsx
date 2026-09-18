import { Link } from "react-router-dom";
import { useUpdateClient } from "../../hooks/clients/useUpdateClient";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function ClientRow({ client, showKeyClientSettings = false }) {
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { mutate: updateClient } = useUpdateClient(client._id);

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 font-medium">
        <Link to={`/clients/${client._id}`} className="hover:text-accent">
          {client.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-text-secondary">
        {client.phoneNumbers?.join("، ") || "—"}
      </td>
      {showKeyClientSettings && (
        <>
          <td className="px-4 py-3 text-text-secondary">
            {client.keyClientSettings?.defaultAgreedHours ?? 24} ساعة
          </td>
          <td className="px-4 py-3 text-text-secondary">
            {((client.keyClientSettings?.defaultLateCommission ?? 500) / 100).toLocaleString(
              "ar-EG"
            )}{" "}
            جنيه
          </td>
        </>
      )}
      <td className="px-4 py-3">
        {isAdmin ? (
          <button
            onClick={() => updateClient({ isActive: !client.isActive })}
            className={`rounded-full px-2.5 py-1 text-xs ${
              client.isActive
                ? "bg-accent-soft text-accent"
                : "bg-danger-soft text-danger"
            }`}
          >
            {client.isActive ? "نشط" : "غير نشط"}
          </button>
        ) : (
          <span
            className={`rounded-full px-2.5 py-1 text-xs ${
              client.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
            }`}
          >
            {client.isActive ? "نشط" : "غير نشط"}
          </span>
        )}
      </td>
    </tr>
  );
}
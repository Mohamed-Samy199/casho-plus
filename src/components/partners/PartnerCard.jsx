import { ArrowLeft, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";

export default function PartnerCard({ partner }) {
  const phones = partner.phoneNumbers || [];

  return (
    <Link to={`/partners/${partner._id}`} className="block h-full">
      <Card className="group h-full border-border/80 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-black/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold text-text-primary">{partner.name}</h3>
              <p className="mt-1 text-xs text-text-secondary">
                {phones.length} {phones.length === 1 ? "رقم مسجّل" : "أرقام مسجّلة"}
              </p>
            </div>
          </div>
          <ArrowLeft
            size={18}
            className="mt-1 shrink-0 text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">
            <Phone size={15} className="shrink-0 text-accent" />
            <span className="truncate">{phones[0] || "لا يوجد رقم"}</span>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
              partner.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
            }`}
          >
            {partner.isActive ? "نشط" : "غير نشط"}
          </span>
        </div>
      </Card>
    </Link>
  );
}

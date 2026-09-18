import { Link } from "react-router-dom";
import Card from "../ui/Card";

export default function PartnerCard({ partner }) {
  return (
    <Link to={`/partners/${partner._id}`}>
      <Card className="transition-colors hover:border-accent">
        <p className="font-medium">{partner.name}</p>
        <p className="mt-1 text-sm text-text-secondary">
          {partner.phoneNumbers?.length
            ? `${partner.phoneNumbers.length} رقم مسجّل`
            : "لا يوجد أرقام مسجّلة"}
        </p>
        {!partner.isActive && (
          <span className="mt-2 inline-block rounded-full bg-danger-soft px-2 py-0.5 text-xs text-danger">
            غير نشط
          </span>
        )}
      </Card>
    </Link>
  );
}
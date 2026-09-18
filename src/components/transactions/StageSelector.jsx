import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { STAGES, STAGE_LABELS, WALLET_UP_STAGES } from "../../constants/stages";

const STAGE_LIST = Object.values(STAGES);

export default function StageSelector({ value, onChange }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm text-text-secondary">المرحلة</span>
      <div className="grid grid-cols-2 gap-2">
        {STAGE_LIST.map((stage) => {
          const isWalletUp = WALLET_UP_STAGES.includes(stage);
          const isSelected = value === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => onChange(stage)}
              className={`flex flex-col items-start gap-2 rounded-lg border px-3 py-2.5 text-right transition-colors ${
                isSelected
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-bg-raised hover:border-accent"
              }`}
            >
              <span className="text-sm font-medium">{STAGE_LABELS[stage]}</span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                {isWalletUp ? (
                  <>
                    <ArrowUpCircle size={14} className="text-accent" /> محفظة
                    <ArrowDownCircle size={14} className="text-danger" /> سيولة
                  </>
                ) : (
                  <>
                    <ArrowDownCircle size={14} className="text-danger" /> محفظة
                    <ArrowUpCircle size={14} className="text-accent" /> سيولة
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
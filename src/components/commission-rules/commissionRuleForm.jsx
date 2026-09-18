import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useUpsertCommissionRule } from "../../hooks/commission-rules/useCommissionRules";
import { STAGE_LABELS } from "../../constants/stages";
import { CHANNEL_LABELS } from "../../constants/channels";
import { egpToPiasters, piastersToEGP } from "../../utils/money";

const TYPE_OPTIONS = [
  { value: "flat", label: "مبلغ ثابت" },
  { value: "proportional", label: "نسبي (لكل 1000 جنيه)" },
];

export default function CommissionRuleForm({ channel, stage, rule }) {
  const [type, setType] = useState(rule?.type || "flat");
  const [flatAmount, setFlatAmount] = useState(String(piastersToEGP(rule?.flatAmount || 0)));
  const [proportionalRate, setProportionalRate] = useState(
    String(piastersToEGP(rule?.proportionalRate || 0))
  );
  const [proportionalThreshold, setProportionalThreshold] = useState(
    String(piastersToEGP(rule?.proportionalThreshold || 0))
  );

  const { mutate: upsertRule, isPending, error, isSuccess } = useUpsertCommissionRule();

  const handleSubmit = (e) => {
    e.preventDefault();
    upsertRule({
      channel,
      stage,
      type,
      flatAmount: egpToPiasters(flatAmount),
      proportionalRate: egpToPiasters(proportionalRate),
      proportionalThreshold: egpToPiasters(proportionalThreshold),
      isActive: true,
    });
  };

  return (
    <Card>
      <div className="mb-4">
        <p className="font-medium">{STAGE_LABELS[stage]}</p>
        <p className="text-sm text-text-secondary">{CHANNEL_LABELS[channel]}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Select
          label="نوع العمولة"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={TYPE_OPTIONS}
        />

        {type === "flat" ? (
          <Input
            label="المبلغ الثابت (جنيه)"
            type="number"
            min="0"
            step="0.01"
            value={flatAmount}
            onChange={(e) => setFlatAmount(e.target.value)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="العمولة لكل 1000 جنيه"
              type="number"
              min="0"
              step="0.01"
              value={proportionalRate}
              onChange={(e) => setProportionalRate(e.target.value)}
            />
            <Input
              label="الحد الأدنى للنسبي (جنيه)"
              type="number"
              min="0"
              step="0.01"
              value={proportionalThreshold}
              onChange={(e) => setProportionalThreshold(e.target.value)}
            />
            <Input
              label="العمولة تحت الحد (جنيه)"
              type="number"
              min="0"
              step="0.01"
              value={flatAmount}
              onChange={(e) => setFlatAmount(e.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء الحفظ."}
          </p>
        )}

        {isSuccess && (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
            تم حفظ القاعدة بنجاح.
          </p>
        )}

        <SubmitButton isLoading={isPending}>حفظ</SubmitButton>
      </form>
    </Card>
  );
}
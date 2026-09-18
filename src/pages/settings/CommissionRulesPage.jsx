import { useCommissionRules } from "../../hooks/commission-rules/useCommissionRules";
import Spinner from "../../components/ui/Spinner";
import { CHANNELS } from "../../constants/channels";
import { STAGES } from "../../constants/stages";
import CommissionRuleForm from "../../components/commission-rules/commissionRuleForm";

export default function CommissionRulesPage() {
  const { data: rules, isLoading, isError } = useCommissionRules();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل قواعد العمولة.</p>;
  }

  // كل قناة × كل مرحلة = قاعدة واحدة. لو مفيش قاعدة متسجلة، الفورم بيبدأ فاضي.
  const channels = Object.values(CHANNELS);
  const stages = Object.values(STAGES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">قواعد العمولة</h1>
        <p className="mt-1 text-sm text-text-secondary">
          العمولة دي بتتحسب تلقائيًا وقت تسجيل العملية، والموظف يقدر يعدّلها لكل عملية على حدة من
          غير ما تتأثر العمليات التانية.
        </p>
      </div>

      {channels.map((channel) => (
        <div key={channel} className="space-y-4">
          {stages.map((stage) => {
            const rule = rules?.find((r) => r.channel === channel && r.stage === stage);
            return (
              <CommissionRuleForm
                key={`${channel}-${stage}`}
                channel={channel}
                stage={stage}
                rule={rule}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
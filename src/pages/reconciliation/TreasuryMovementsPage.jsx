import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Landmark,
  RefreshCw,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import { useTreasuryMovements } from "../../hooks/reconciliation/useTreasuryMovements";
import { formatEGP } from "../../utils/money";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const KIND_LABELS = {
  transaction: "عملية مالية",
  adjustment: "تعديل رصيد",
  internal_transfer: "تحويل داخلي",
};

const ASSET_LABELS = {
  liquidity: {
    title: "السيولة النقدية",
    description: "الكاش الجاهز للشغل داخل المكتب.",
    icon: Landmark,
  },
  wallet: {
    title: "رصيد المحافظ الإلكترونية",
    description: "إجمالي الرصيد الإلكتروني على المحافظ.",
    icon: Wallet,
  },
};

export default function TreasuryMovementsPage() {
  const today = useMemo(todayKey, []);
  const [asset, setAsset] = useState("liquidity");
  const [filters, setFilters] = useState({
    from: today,
    to: today,
    page: 1,
    size: 20,
    asset: "liquidity",
  });
  const { data, isLoading, isError, error } = useTreasuryMovements(filters);
  const assetInfo = ASSET_LABELS[asset];

  const changeAsset = (nextAsset) => {
    setAsset(nextAsset);
    setFilters((current) => ({ ...current, asset: nextAsset, page: 1 }));
  };
  const updateDate = (field) => (event) => {
    setFilters((current) => ({
      ...current,
      [field]: event.target.value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">حركة الخزينة</h1>
        <p className="mt-1 text-sm text-white/60">
          تابع حركة السيولة أو رصيد المحافظ الإلكترونية خلال الفترة المحددة.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(ASSET_LABELS).map(([key, info]) => {
          const Icon = info.icon;
          const selected = key === asset;
          return (
            <button
              key={key}
              type="button"
              onClick={() => changeAsset(key)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-right transition-colors ${selected ? "border-accent bg-accent-soft text-accent" : "border-border bg-bg-raised text-text-secondary hover:border-accent"}`}
            >
              <Icon size={22} />
              <span>
                <span className="block font-bold">{info.title}</span>
                <span className="mt-1 block text-xs opacity-80">
                  {info.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
          <Input
            type="date"
            label="من تاريخ"
            value={filters.from}
            onChange={updateDate("from")}
          />
          <Input
            type="date"
            label="إلى تاريخ"
            value={filters.to}
            onChange={updateDate("to")}
          />
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, page: 1 }))}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <RefreshCw size={16} /> تحديث التقرير
          </button>
        </div>
      </Card>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
      {isError && (
        <p className="py-10 text-center text-danger">
          تعذر تحميل تقرير الخزينة:{" "}
          {error?.response?.data?.message || error?.message}
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="رصيد أول الفترة"
              value={data.openingBalance}
              icon={Landmark}
              tone="text-accent"
            />
            <SummaryCard
              title="إجمالي الداخل"
              value={data.inflow}
              icon={ArrowDownToLine}
              tone="text-accent"
            />
            <SummaryCard
              title="إجمالي الخارج"
              value={data.outflow}
              icon={ArrowUpFromLine}
              tone="text-danger"
            />
            <SummaryCard
              title="رصيد آخر الفترة المتوقع"
              value={data.closingBalance}
              icon={assetInfo.icon}
              tone="text-accent"
            />
          </div>

          {/* <Card>
            <div className="mb-4">
              <h2 className="font-bold">تطور {assetInfo.title}</h2>
              <p className="text-sm text-text-secondary">
                الرسم يوضح الرصيد التراكمي بعد كل حركة خلال الفترة.
              </p>
            </div>
            {data.chart?.length ? (
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.chart}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("ar-EG")
                      }
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tickFormatter={(value) => formatEGP(value)}
                      stroke="#94a3b8"
                      width={80}
                    />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString("ar-EG")
                      }
                      formatter={(value) => [formatEGP(value), "الرصيد"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="balanceAfter"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-8 text-center text-text-secondary">
                لا توجد حركات لرسم تطور الرصيد.
              </p>
            )}
          </Card> */}

          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-bold">تفاصيل {assetInfo.title}</h2>
                <p className="text-sm text-text-secondary">
                  البيان معروض بالعربية، والقيم تخص التبويب المحدد فقط.
                </p>
              </div>
              <div className="text-sm text-text-secondary">
                التحويلات الداخلية: {data.internalTransferCount || 0} (
                {formatEGP(data.internalTransferAmount || 0)})
              </div>
            </div>

            {!data.result?.length ? (
              <p className="py-10 text-center text-text-secondary">
                لا توجد حركات في الفترة المحددة.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-right text-text-secondary">
                        <th className="px-3 py-3 font-medium">
                          التاريخ والوقت
                        </th>
                        <th className="px-3 py-3 font-medium">رقم العملية</th>
                        <th className="px-3 py-3 font-medium">البيان</th>
                        <th className="px-3 py-3 font-medium">النوع</th>
                        <th className="px-3 py-3 font-medium">الداخل</th>
                        <th className="px-3 py-3 font-medium">الخارج</th>
                        <th className="px-3 py-3 font-medium">
                          الرصيد بعد الحركة
                        </th>
                        <th className="px-3 py-3 font-medium">المسؤول</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.result.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-3 py-3 text-text-secondary">
                            {new Date(item.createdAt).toLocaleString("ar-EG")}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs">
                            {item.referenceNumber || "—"}
                          </td>
                          <td className="px-3 py-3">{item.description}</td>
                          <td className="px-3 py-3 text-text-secondary">
                            {KIND_LABELS[item.kind] || item.kind}
                          </td>
                          <td className="px-3 py-3 text-accent">
                            {item.inflow ? formatEGP(item.inflow) : "—"}
                          </td>
                          <td className="px-3 py-3 text-danger">
                            {item.outflow ? formatEGP(item.outflow) : "—"}
                          </td>
                          <td className="px-3 py-3 font-medium">
                            {formatEGP(item.balanceAfter)}
                          </td>
                          <td className="px-3 py-3">
                            {item.createdBy?.name || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5">
                  <Pagination
                    currentPage={data.currentPage || filters.page}
                    pages={data.pages}
                    onPageChange={(page) =>
                      setFilters((current) => ({ ...current, page }))
                    }
                  />
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, tone = "text-white" }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className={`mt-3 text-2xl font-bold ${tone}`}>
            {formatEGP(value)}
          </p>
        </div>
        <Icon size={22} className="text-accent" />
      </div>
    </Card>
  );
}

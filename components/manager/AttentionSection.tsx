import type { Insight } from "@/lib/insights-agent";
import { AlertIcon, CheckIcon, SparkIcon } from "@/components/ui/Icons";

type InsightAction = NonNullable<Insight["action"]>;

const severityStyles = {
  critical: {
    card: "border-red-200 bg-red-50/70",
    icon: "bg-red-100 text-red-700",
    title: "text-red-900",
    description: "text-red-700",
    label: "דחוף",
  },
  warning: {
    card: "border-amber-200 bg-amber-50/60",
    icon: "bg-amber-100 text-amber-700",
    title: "text-amber-950",
    description: "text-amber-800/80",
    label: "לתשומת לב",
  },
  info: {
    card: "border-brand-100 bg-brand-50/50",
    icon: "bg-brand-100 text-brand-700",
    title: "text-brand-900",
    description: "text-brand-800/75",
    label: "מידע",
  },
} satisfies Record<Insight["severity"], Record<string, string>>;

export function AttentionSection({
  insights,
  onAction,
}: {
  insights: Insight[];
  onAction: (action: InsightAction) => void;
}) {
  return (
    <section className="surface overflow-hidden" aria-labelledby="manager-insights-title">
      <div className="flex items-end justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <p className="eyebrow">דורש תשומת לב</p>
          <h2 id="manager-insights-title" className="mt-1 text-xl font-extrabold">תובנות חכמות</h2>
        </div>
        {insights.length > 0 && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {insights.length} תובנות
          </span>
        )}
      </div>

      {insights.length > 0 ? (
        <div className="grid gap-3 p-4 md:grid-cols-3 md:p-5">
          {insights.map((insight) => {
            const styles = severityStyles[insight.severity];
            const Icon = insight.severity === "info" ? SparkIcon : AlertIcon;
            const action = insight.action;

            return (
              <article key={insight.id} className={`flex min-h-44 flex-col rounded-2xl border p-4 text-right ${styles.card}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${styles.icon}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`rounded-full bg-white/75 px-2.5 py-1 text-[0.7rem] font-bold ${styles.description}`}>
                    {styles.label}
                  </span>
                </div>
                <h3 className={`mt-3 text-sm font-extrabold leading-5 ${styles.title}`}>{insight.title}</h3>
                <p className={`mt-1 text-sm leading-5 ${styles.description}`}>{insight.description}</p>
                {action && (
                  <button
                    type="button"
                    className="mt-auto min-h-11 self-start pt-3 text-sm font-bold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900"
                    onClick={() => onAction(action)}
                  >
                    {action.label}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-5 text-emerald-800">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50">
            <CheckIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">הכול נראה תקין כרגע</p>
            <p className="mt-0.5 text-sm text-slate-500">אין נושאים חריגים שדורשים טיפול.</p>
          </div>
        </div>
      )}
    </section>
  );
}

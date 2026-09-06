import type { EquipmentItem } from "@/lib/types";
import { getEquipmentStats } from "@/lib/selectors";
import { BoxIcon, CheckIcon, ClockIcon, AlertIcon } from "@/components/ui/Icons";

const cards = [
  { key: "total" as const, label: "סה״כ פריטים", hint: "במלאי", icon: BoxIcon, color: "bg-brand-50 text-brand-700", bar: "bg-brand-500" },
  { key: "available" as const, label: "זמינים", hint: "להשאלה כעת", icon: CheckIcon, color: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
  { key: "borrowed" as const, label: "מושאלים", hint: "אצל עובדים", icon: ClockIcon, color: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  { key: "unavailable" as const, label: "לא זמינים", hint: "דורשים טיפול", icon: AlertIcon, color: "bg-slate-100 text-slate-600", bar: "bg-slate-400" },
];

export function StatsCards({ equipment }: { equipment: EquipmentItem[] }) {
  const stats = getEquipmentStats(equipment);

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, label, hint, icon: Icon, color, bar }) => (
        <article key={key} className="surface relative min-h-32 overflow-hidden p-4 text-right sm:p-5">
          <span className={`absolute inset-y-0 right-0 w-1 ${bar}`} />
          <div className="flex items-start justify-between gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="metric-number" aria-label={`${stats[key]} ${label}`}>
              {stats[key]}
            </p>
          </div>
          <div className="mt-4">
            <p className="metric-label">{label}</p>
            <p className="metric-hint hidden sm:block">{hint}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

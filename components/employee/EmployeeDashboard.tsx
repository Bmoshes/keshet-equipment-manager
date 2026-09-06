import type { EquipmentItem, Loan, User } from "@/lib/types";
import { EquipmentList } from "@/components/equipment/EquipmentList";
import { BoxIcon, CheckIcon, SparkIcon } from "@/components/ui/Icons";
import { getAvailableEquipment, getEmployeeActiveLoans } from "@/lib/selectors";
import { MyEquipment } from "./MyEquipment";

export function EmployeeDashboard({
  user,
  equipment,
  loans,
  onBorrow,
  onReturn,
}: {
  user: User;
  equipment: EquipmentItem[];
  loans: Loan[];
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}) {
  const state = { equipment, loans };
  const myItemsCount = getEmployeeActiveLoans(state, user.id).length;
  const availableCount = getAvailableEquipment(state).length;

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="surface relative overflow-hidden border-brand-100 bg-gradient-to-l from-white via-white to-brand-50/60 p-5 sm:p-6">
        <div className="pointer-events-none absolute -left-12 -top-16 h-44 w-44 rounded-full border-[28px] border-brand-100/35" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-1.5"><SparkIcon className="h-3.5 w-3.5" />סביבת העבודה שלך</p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">שלום, {user.name}</h1>
            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">הציוד שלך והמלאי הזמין, במבט אחד.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[21rem]">
            <div className="rounded-2xl border border-white bg-white/85 p-3.5 text-right shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><BoxIcon className="h-4 w-4" /></span>
                <p className="metric-number text-2xl">{myItemsCount}</p>
              </div>
              <p className="metric-label mt-3 text-xs text-slate-600">פריטים אצלך</p>
            </div>

            <div className="rounded-2xl border border-white bg-white/85 p-3.5 text-right shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><CheckIcon className="h-4 w-4" /></span>
                <p className="metric-number text-2xl">{availableCount}</p>
              </div>
              <p className="metric-label mt-3 text-xs text-slate-600">זמינים עכשיו</p>
            </div>
          </div>
        </div>
      </section>

      <MyEquipment equipment={equipment} loans={loans} employeeId={user.id} onReturn={onReturn} />
      <EquipmentList equipment={equipment} loans={loans} role="employee" currentUserId={user.id} onBorrow={onBorrow} onAvailabilityChange={() => undefined} />
    </main>
  );
}

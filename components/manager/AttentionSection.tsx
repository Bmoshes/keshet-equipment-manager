import type { InventoryState } from "@/lib/types";
import { getLongRunningLoans } from "@/lib/selectors";
import { AlertIcon, ClockIcon } from "@/components/ui/Icons";

export function AttentionSection({ state }: { state: InventoryState }) {
  const longRunning = getLongRunningLoans(state);
  const unavailable = state.equipment.filter((item) => item.status === "unavailable");
  const attentionCount = longRunning.length + unavailable.length;
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-end justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5"><div><p className="eyebrow">תמונת מצב</p><h2 className="mt-1 text-xl font-extrabold">דורש תשומת לב</h2></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{attentionCount} נקודות למעקב</span></div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <article className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-gradient-to-l from-amber-50 to-white p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><ClockIcon /></span><div><p className="text-2xl font-extrabold text-amber-900">{longRunning.length}</p><p className="text-sm font-bold text-amber-800">פריטים מושאלים זמן רב</p><p className="mt-0.5 text-xs text-amber-700/70">יותר מ־7 ימים ברצף</p></div></article>
        <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-l from-slate-50 to-white p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-600"><AlertIcon /></span><div><p className="text-2xl font-extrabold">{unavailable.length}</p><p className="text-sm font-bold">פריטים שאינם זמינים</p><p className="mt-0.5 text-xs text-slate-500">תחזוקה, תקלה או בדיקה</p></div></article>
      </div>
    </section>
  );
}

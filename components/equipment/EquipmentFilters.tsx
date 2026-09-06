import type { EquipmentCategory, EquipmentStatus } from "@/lib/types";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

export type StatusFilter = "all" | EquipmentStatus;
export type CategoryFilter = "all" | EquipmentCategory;

export function EquipmentFilters({ search, status, category, onSearch, onStatus, onCategory }: { search: string; status: StatusFilter; category: CategoryFilter; onSearch: (value: string) => void; onStatus: (value: StatusFilter) => void; onCategory: (value: CategoryFilter) => void }) {
  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: "הכול" },
    { value: "available", label: "זמין" },
    { value: "borrowed", label: "מושאל" },
    { value: "unavailable", label: "לא זמין" },
  ];

  return (
    <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(260px,1fr)_190px]">
        <label className="relative"><span className="sr-only">חיפוש ציוד</span><SearchIcon className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="חיפוש לפי שם או מספר נכס" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-10 text-sm font-semibold transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100" />{search && <button type="button" onClick={() => onSearch("")} className="absolute left-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-ink" aria-label="ניקוי החיפוש"><CloseIcon className="h-4 w-4" /></button>}</label>
        <label><span className="sr-only">סינון לפי קטגוריה</span><select value={category} onChange={(event) => onCategory(event.target.value as CategoryFilter)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"><option value="all">כל הקטגוריות</option><option value="laptop">מחשב נייד</option><option value="monitor">מסך</option><option value="projector">מקרן</option><option value="recording">ציוד הקלטה</option></select></label>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5" aria-label="סינון לפי סטטוס">{statusOptions.map((option) => <button key={option.value} type="button" onClick={() => onStatus(option.value)} aria-pressed={status === option.value} className={`min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-bold transition ${status === option.value ? "border-brand-600 bg-brand-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"}`}>{option.label}</button>)}</div>
    </div>
  );
}

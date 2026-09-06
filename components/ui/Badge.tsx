import type { EquipmentStatus } from "@/lib/types";
import { statusLabels } from "@/lib/utils";

const styles: Record<EquipmentStatus, string> = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  borrowed: "bg-amber-50 text-amber-700 ring-amber-600/15",
  unavailable: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

export function Badge({ status }: { status: EquipmentStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabels[status]}</span>;
}

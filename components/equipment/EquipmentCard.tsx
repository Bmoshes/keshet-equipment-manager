import type { EquipmentItem, EquipmentCategory, Role } from "@/lib/types";
import { categoryLabels } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { LaptopIcon, MicIcon, MonitorIcon, ProjectorIcon } from "@/components/ui/Icons";

const categoryIcons: Record<EquipmentCategory, React.ComponentType<{ className?: string }>> = { laptop: LaptopIcon, monitor: MonitorIcon, projector: ProjectorIcon, recording: MicIcon };

export function EquipmentCard({ item, role, isMine, onBorrow, onAvailabilityChange }: { item: EquipmentItem; role: Role; isMine: boolean; onBorrow: (id: string) => void; onAvailabilityChange: (id: string, available: boolean) => void }) {
  const Icon = categoryIcons[item.category];
  return (
    <article className="group flex min-h-52 flex-col rounded-2xl border border-slate-200/90 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card sm:p-4">
      <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100"><Icon className="h-5 w-5" /></span><Badge status={item.status} /></div>
      <div className="mt-3.5 flex-1"><h3 className="font-extrabold leading-snug text-ink">{item.name}</h3><div className="mt-1.5 flex flex-wrap items-center gap-2"><span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500" dir="ltr">{item.assetTag}</span><span className="text-xs text-slate-400">{categoryLabels[item.category]}</span></div></div>
      <div className="mt-3.5 border-t border-slate-100 pt-3.5">
        {role === "employee" && item.status === "available" && <button className="primary-button w-full" onClick={() => onBorrow(item.id)}>השאל פריט</button>}
        {role === "employee" && item.status === "borrowed" && <p className={`rounded-xl py-2 text-center text-sm font-bold ${isMine ? "bg-brand-50 text-brand-700" : "bg-slate-50 text-slate-500"}`}>{isMine ? "נמצא אצלך" : "נמצא בשימוש"}</p>}
        {role === "employee" && item.status === "unavailable" && <p className="rounded-xl bg-slate-50 py-2 text-center text-sm font-semibold text-slate-500">אינו זמין להשאלה</p>}
        {role === "manager" && item.status === "available" && <button className="secondary-button w-full" onClick={() => onAvailabilityChange(item.id, false)}>סמן כלא זמין</button>}
        {role === "manager" && item.status === "unavailable" && <button className="primary-button w-full" onClick={() => onAvailabilityChange(item.id, true)}>החזר לזמינות</button>}
        {role === "manager" && item.status === "borrowed" && <p className="rounded-xl bg-amber-50 py-2 text-center text-sm font-semibold text-amber-700">יש לסיים את ההשאלה תחילה</p>}
      </div>
    </article>
  );
}

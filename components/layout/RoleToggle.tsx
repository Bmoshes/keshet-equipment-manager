import type { Role } from "@/lib/types";
import { BriefcaseIcon, UserIcon } from "@/components/ui/Icons";

export function RoleToggle({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  return (
    <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1" aria-label="בחירת תפקיד">
      <button onClick={() => onChange("employee")} className={`flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold transition sm:min-h-10 sm:gap-2 sm:px-3.5 ${role === "employee" ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"}`} aria-pressed={role === "employee"}><UserIcon className="h-4 w-4" />עובד</button>
      <button onClick={() => onChange("manager")} className={`flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold transition sm:min-h-10 sm:gap-2 sm:px-3.5 ${role === "manager" ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-ink"}`} aria-pressed={role === "manager"}><BriefcaseIcon className="h-4 w-4" />מנהל</button>
    </div>
  );
}

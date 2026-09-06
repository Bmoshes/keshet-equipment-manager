import type { Role } from "@/lib/types";
import { BoxIcon } from "@/components/ui/Icons";
import { RoleToggle } from "./RoleToggle";

export function Header({ role, onRoleChange }: { role: Role; onRoleChange: (role: Role) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_1px_12px_rgba(16,45,59,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-md shadow-brand-600/15 sm:h-11 sm:w-11"><BoxIcon /></span>
          <div><p className="text-base font-extrabold tracking-tight sm:text-lg">ניהול ציוד</p><p className="text-[11px] font-semibold text-slate-500 sm:text-xs">קשת פיננסים</p></div>
        </div>
        <div className="flex items-center gap-3"><span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />מצב הדגמה</span><RoleToggle role={role} onChange={onRoleChange} /></div>
      </div>
    </header>
  );
}

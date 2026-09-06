"use client";

import { useMemo, useState } from "react";
import type { EquipmentItem, Loan, Role } from "@/lib/types";
import { EquipmentCard } from "./EquipmentCard";
import { EquipmentFilters, type CategoryFilter, type StatusFilter } from "./EquipmentFilters";
import { BoxIcon } from "@/components/ui/Icons";

export function EquipmentList({ equipment, loans, role, currentUserId, onBorrow, onAvailabilityChange }: { equipment: EquipmentItem[]; loans: Loan[]; role: Role; currentUserId: string; onBorrow: (id: string) => void; onAvailabilityChange: (id: string, available: boolean) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const filtered = useMemo(() => equipment.filter((item) => {
    const query = search.trim().toLocaleLowerCase("he");
    return (!query || item.name.toLocaleLowerCase("he").includes(query) || item.assetTag.toLocaleLowerCase().includes(query)) && (status === "all" || item.status === status) && (category === "all" || item.category === category);
  }).sort((first, second) => {
    const employeeOrder = { available: 0, borrowed: 1, unavailable: 2 };
    const managerOrder = { borrowed: 0, unavailable: 1, available: 2 };
    const order = role === "employee" ? employeeOrder : managerOrder;
    return order[first.status] - order[second.status] || first.name.localeCompare(second.name, "he");
  }), [equipment, search, status, category, role]);

  const mine = new Set(loans.filter((loan) => loan.status === "active" && loan.employeeId === currentUserId).map((loan) => loan.equipmentId));
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-end justify-between gap-4 px-4 pt-5 sm:px-5 sm:pt-6"><div><p className="eyebrow">מלאי משותף</p><h2 className="mt-1 text-xl font-extrabold">כל הציוד</h2></div><p className="whitespace-nowrap text-xs font-semibold text-slate-500 sm:text-sm"><strong className="text-ink">{filtered.length}</strong> מתוך {equipment.length}</p></div>
      <EquipmentFilters search={search} status={status} category={category} onSearch={setSearch} onStatus={setStatus} onCategory={setCategory} />
      {filtered.length > 0 ? <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((item) => <EquipmentCard key={item.id} item={item} role={role} isMine={mine.has(item.id)} onBorrow={onBorrow} onAvailabilityChange={onAvailabilityChange} />)}</div> : <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><BoxIcon /></span><h3 className="mt-4 text-lg font-extrabold">לא נמצאו פריטים</h3><p className="mt-1 text-sm text-slate-500">נסו חיפוש אחר או שנו את הסינון.</p><button onClick={() => { setSearch(""); setStatus("all"); setCategory("all"); }} className="secondary-button mt-4">נקה את כל הסינונים</button></div></div>}
    </section>
  );
}

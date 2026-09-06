"use client";

import { useCallback, useState } from "react";
import type { EquipmentItem, Loan, NewEquipmentInput, ServiceResult, User } from "@/lib/types";
import { generateManagerInsights, type Insight } from "@/lib/insights-agent";
import { EquipmentList } from "@/components/equipment/EquipmentList";
import { PlusIcon, SparkIcon } from "@/components/ui/Icons";
import { ActiveLoans } from "./ActiveLoans";
import { AddEquipmentDrawer } from "./AddEquipmentDrawer";
import { AttentionSection } from "./AttentionSection";
import { StatsCards } from "./StatsCards";

type InsightAction = NonNullable<Insight["action"]>;

export function ManagerDashboard({
  equipment,
  loans,
  users,
  currentUserId,
  onReturn,
  onAvailabilityChange,
  onAdd,
}: {
  equipment: EquipmentItem[];
  loans: Loan[];
  users: User[];
  currentUserId: string;
  onReturn: (id: string) => void;
  onAvailabilityChange: (id: string, available: boolean) => void;
  onAdd: (input: NewEquipmentInput) => ServiceResult;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const insights = generateManagerInsights(equipment, loans, users);

  const handleInsightAction = (action: InsightAction) => {
    const targetId = action.type === "long-loans" || action.type === "employee-load"
      ? "active-loans"
      : "equipment-list";
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById(targetId)?.scrollIntoView({ behavior, block: "start" });
  };

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5"><SparkIcon className="h-3.5 w-3.5" />מרכז בקרה</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">תמונת מצב ניהולית</h1>
          <p className="mt-1.5 text-sm text-slate-500 sm:text-base">כל מה שצריך לדעת על הציוד המשותף, במקום אחד.</p>
        </div>
        <button className="primary-button w-full sm:w-auto sm:min-w-36" onClick={() => setDrawerOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          הוספת פריט
        </button>
      </section>

      <StatsCards equipment={equipment} />
      <AttentionSection insights={insights} onAction={handleInsightAction} />
      <ActiveLoans equipment={equipment} loans={loans} users={users} onReturn={onReturn} />
      <EquipmentList equipment={equipment} loans={loans} role="manager" currentUserId={currentUserId} onBorrow={() => undefined} onAvailabilityChange={onAvailabilityChange} />
      <AddEquipmentDrawer open={drawerOpen} onClose={closeDrawer} onSubmit={onAdd} />
    </main>
  );
}

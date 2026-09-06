"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Alert } from "@/components/ui/Alert";
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { ManagerDashboard } from "@/components/manager/ManagerDashboard";
import { currentUser, initialEquipment, initialLoans, users } from "@/lib/mock-data";
import { addEquipment, borrowEquipment, markEquipmentAvailable, markEquipmentUnavailable, returnEquipment } from "@/lib/equipment-service";
import type { InventoryState, NewEquipmentInput, Role, ServiceResult } from "@/lib/types";

type Feedback = { type: "success" | "error"; message: string } | null;

export default function Home() {
  const [role, setRole] = useState<Role>("employee");
  const [state, setState] = useState<InventoryState>({ equipment: initialEquipment, loans: initialLoans });
  const [feedback, setFeedback] = useState<Feedback>(null);

  const applyResult = (result: ServiceResult) => {
    if (result.ok) setState(result.state);
    setFeedback({ type: result.ok ? "success" : "error", message: result.message });
  };

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setFeedback(null);
  };

  const handleAddEquipment = (input: NewEquipmentInput) => {
    const result = addEquipment(state, input, role, crypto.randomUUID());
    applyResult(result);
    return result;
  };

  return (
    <div className="min-h-screen">
      <Header role={role} onRoleChange={changeRole} />
      {role === "employee" ? (
        <EmployeeDashboard user={currentUser} equipment={state.equipment} loans={state.loans} onBorrow={(id) => applyResult(borrowEquipment(state, id, currentUser.id))} onReturn={(id) => applyResult(returnEquipment(state, id, currentUser.id, "employee"))} />
      ) : (
        <ManagerDashboard equipment={state.equipment} loans={state.loans} users={users} currentUserId={currentUser.id} onReturn={(id) => applyResult(returnEquipment(state, id, currentUser.id, "manager"))} onAvailabilityChange={(id, available) => applyResult(available ? markEquipmentAvailable(state, id, "manager") : markEquipmentUnavailable(state, id, "manager"))} onAdd={handleAddEquipment} />
      )}
      {feedback && <Alert type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-400 sm:px-6 lg:px-8">מערכת דמו פנימית · הנתונים נשמרים בזיכרון בלבד</footer>
    </div>
  );
}

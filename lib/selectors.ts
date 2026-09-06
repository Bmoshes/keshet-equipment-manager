import type { EquipmentItem, InventoryState, Loan } from "./types";

export const getAvailableEquipment = (state: InventoryState) => state.equipment.filter((item) => item.status === "available");
export const getActiveLoans = (state: InventoryState) => state.loans.filter((loan) => loan.status === "active");
export const getEmployeeActiveLoans = (state: InventoryState, employeeId: string) => getActiveLoans(state).filter((loan) => loan.employeeId === employeeId);
export const getLongRunningLoans = (state: InventoryState, minimumDays = 7) => getActiveLoans(state).filter((loan) => Date.now() - new Date(loan.borrowedAt).getTime() > minimumDays * 86_400_000);

export const getEquipmentStats = (equipment: EquipmentItem[]) => ({
  total: equipment.length,
  available: equipment.filter((item) => item.status === "available").length,
  borrowed: equipment.filter((item) => item.status === "borrowed").length,
  unavailable: equipment.filter((item) => item.status === "unavailable").length,
});

export const getEquipmentForLoan = (state: InventoryState, loan: Loan) => state.equipment.find((item) => item.id === loan.equipmentId);

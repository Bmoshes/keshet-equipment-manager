export type Role = "employee" | "manager";
export type EquipmentCategory = "laptop" | "monitor" | "projector" | "recording";
export type EquipmentStatus = "available" | "borrowed" | "unavailable";
export type LoanStatus = "active" | "returned";

export interface User {
  id: string;
  name: string;
}

export interface EquipmentItem {
  id: string;
  assetTag: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
}

export interface NewEquipmentInput {
  name: string;
  assetTag: string;
  category: EquipmentCategory;
  status: Exclude<EquipmentStatus, "borrowed">;
}

export interface Loan {
  id: string;
  equipmentId: string;
  employeeId: string;
  borrowedAt: string;
  returnedAt: string | null;
  status: LoanStatus;
}

export interface InventoryState {
  equipment: EquipmentItem[];
  loans: Loan[];
}

export type ServiceResult =
  | { ok: true; message: string; state: InventoryState }
  | { ok: false; message: string; state: InventoryState };

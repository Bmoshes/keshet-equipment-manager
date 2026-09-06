import type { EquipmentItem, Loan, User } from "./types";

const daysAgo = (days: number, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
};

export const users: User[] = [
  { id: "user-bar", name: "בר משה" },
  { id: "user-maya", name: "מאיה כהן" },
  { id: "user-ofek", name: "אופק בן דוד" },
  { id: "user-dani", name: "דני לוי" },
];

export const currentUser = users[0];

export const initialEquipment: EquipmentItem[] = [
  { id: "eq-1", assetTag: "KES-LT-021", name: "MacBook Air M2", category: "laptop", status: "borrowed" },
  { id: "eq-2", assetTag: "KES-MN-014", name: "מסך Dell 27״", category: "monitor", status: "available" },
  { id: "eq-3", assetTag: "KES-PR-003", name: "מקרן Epson FHD", category: "projector", status: "borrowed" },
  { id: "eq-4", assetTag: "KES-RC-008", name: "מיקרופון Rode USB", category: "recording", status: "unavailable" },
  { id: "eq-5", assetTag: "KES-LT-034", name: "Lenovo ThinkPad E14", category: "laptop", status: "available" },
  { id: "eq-6", assetTag: "KES-MN-022", name: "מסך Samsung 24״", category: "monitor", status: "borrowed" },
  { id: "eq-7", assetTag: "KES-RC-011", name: "ערכת תאורת LED", category: "recording", status: "available" },
  { id: "eq-8", assetTag: "KES-LT-041", name: "Dell Latitude 5440", category: "laptop", status: "available" },
  { id: "eq-9", assetTag: "KES-PR-006", name: "מקרן נייד Nebula", category: "projector", status: "available" },
  { id: "eq-10", assetTag: "KES-RC-016", name: "מצלמת Logitech 4K", category: "recording", status: "borrowed" },
  { id: "eq-11", assetTag: "KES-MN-029", name: "מסך LG UltraWide", category: "monitor", status: "unavailable" },
  { id: "eq-12", assetTag: "KES-LT-052", name: "HP ProBook 450", category: "laptop", status: "available" },
];

export const initialLoans: Loan[] = [
  { id: "loan-1", equipmentId: "eq-1", employeeId: "user-bar", borrowedAt: daysAgo(3), returnedAt: null, status: "active" },
  { id: "loan-2", equipmentId: "eq-3", employeeId: "user-maya", borrowedAt: daysAgo(11), returnedAt: null, status: "active" },
  { id: "loan-3", equipmentId: "eq-6", employeeId: "user-ofek", borrowedAt: daysAgo(6), returnedAt: null, status: "active" },
  { id: "loan-4", equipmentId: "eq-10", employeeId: "user-dani", borrowedAt: daysAgo(9), returnedAt: null, status: "active" },
  { id: "loan-5", equipmentId: "eq-7", employeeId: "user-bar", borrowedAt: daysAgo(25), returnedAt: daysAgo(19), status: "returned" },
];

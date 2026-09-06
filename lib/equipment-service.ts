import type { EquipmentCategory, InventoryState, NewEquipmentInput, Role, ServiceResult } from "./types";

const fail = (state: InventoryState, message: string): ServiceResult => ({ ok: false, message, state });
const succeed = (state: InventoryState, message: string): ServiceResult => ({ ok: true, message, state });
const equipmentCategories: EquipmentCategory[] = ["laptop", "monitor", "projector", "recording"];

export function addEquipment(
  state: InventoryState,
  input: NewEquipmentInput,
  role: Role,
  equipmentId: string,
): ServiceResult {
  if (role !== "manager") return fail(state, "רק מנהל יכול להוסיף פריט חדש למלאי.");

  const name = input.name.trim();
  const assetTag = input.assetTag.trim().toLocaleUpperCase("en-US");
  if (!name) return fail(state, "יש להזין שם לפריט.");
  if (!assetTag) return fail(state, "יש להזין מספר נכס.");
  if (!equipmentCategories.includes(input.category)) return fail(state, "יש לבחור קטגוריה תקינה.");
  if (input.status !== "available" && input.status !== "unavailable") {
    return fail(state, "ניתן ליצור פריט חדש כזמין או כלא זמין בלבד.");
  }
  if (state.equipment.some((item) => item.assetTag.trim().toLocaleUpperCase("en-US") === assetTag)) {
    return fail(state, "מספר הנכס כבר קיים במערכת.");
  }

  return succeed(
    {
      ...state,
      equipment: [
        ...state.equipment,
        { id: equipmentId, name, assetTag, category: input.category, status: input.status },
      ],
    },
    "הפריט נוסף למלאי בהצלחה.",
  );
}

export function borrowEquipment(
  state: InventoryState,
  equipmentId: string,
  employeeId: string,
  now = new Date(),
): ServiceResult {
  const item = state.equipment.find((equipment) => equipment.id === equipmentId);
  if (!item) return fail(state, "הפריט המבוקש לא נמצא.");
  if (item.status !== "available" || state.loans.some((loan) => loan.equipmentId === equipmentId && loan.status === "active")) {
    return fail(state, "לא ניתן להשאיל את הפריט — הוא אינו זמין כרגע.");
  }

  return succeed(
    {
      equipment: state.equipment.map((equipment) => equipment.id === equipmentId ? { ...equipment, status: "borrowed" } : equipment),
      loans: [
        ...state.loans,
        { id: `loan-${now.getTime()}`, equipmentId, employeeId, borrowedAt: now.toISOString(), returnedAt: null, status: "active" },
      ],
    },
    "הפריט הושאל אליך בהצלחה.",
  );
}

export function returnEquipment(
  state: InventoryState,
  equipmentId: string,
  actorId: string,
  role: Role,
  now = new Date(),
): ServiceResult {
  const activeLoan = state.loans.find((loan) => loan.equipmentId === equipmentId && loan.status === "active");
  if (!activeLoan) return fail(state, "לא נמצאה השאלה פעילה עבור הפריט.");
  if (role === "employee" && activeLoan.employeeId !== actorId) {
    return fail(state, "אין לך הרשאה להחזיר פריט של עובד אחר.");
  }

  return succeed(
    {
      equipment: state.equipment.map((equipment) => equipment.id === equipmentId ? { ...equipment, status: "available" } : equipment),
      loans: state.loans.map((loan) => loan.id === activeLoan.id ? { ...loan, status: "returned", returnedAt: now.toISOString() } : loan),
    },
    "הפריט הוחזר בהצלחה.",
  );
}

export function markEquipmentUnavailable(state: InventoryState, equipmentId: string, role: Role): ServiceResult {
  if (role !== "manager") return fail(state, "רק מנהל יכול לשנות זמינות של ציוד.");
  const item = state.equipment.find((equipment) => equipment.id === equipmentId);
  if (!item) return fail(state, "הפריט המבוקש לא נמצא.");
  if (item.status === "borrowed") return fail(state, "יש לסיים את ההשאלה לפני סימון הפריט כלא זמין.");
  if (item.status !== "available") return fail(state, "הפריט כבר מסומן כלא זמין.");
  return succeed(
    { ...state, equipment: state.equipment.map((equipment) => equipment.id === equipmentId ? { ...equipment, status: "unavailable" } : equipment) },
    "הפריט סומן כלא זמין.",
  );
}

export function markEquipmentAvailable(state: InventoryState, equipmentId: string, role: Role): ServiceResult {
  if (role !== "manager") return fail(state, "רק מנהל יכול לשנות זמינות של ציוד.");
  const item = state.equipment.find((equipment) => equipment.id === equipmentId);
  if (!item) return fail(state, "הפריט המבוקש לא נמצא.");
  if (item.status !== "unavailable") return fail(state, "ניתן להחזיר לזמינות רק פריט שאינו זמין.");
  return succeed(
    { ...state, equipment: state.equipment.map((equipment) => equipment.id === equipmentId ? { ...equipment, status: "available" } : equipment) },
    "הפריט חזר לרשימת הציוד הזמין.",
  );
}

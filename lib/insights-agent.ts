import type { EquipmentCategory, EquipmentItem, Loan, User } from "./types";

export type InsightSeverity = "info" | "warning" | "critical";

export type Insight = {
  id: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  priority: number;
  action?: {
    label: string;
    type: "long-loans" | "unavailable" | "low-availability" | "employee-load";
    value?: string;
  };
};

export type ManagerAgentReply = {
  text: string;
  action?: NonNullable<Insight["action"]>;
};

export type ManagerAgentPromptId = "overview" | "long-loans" | "low-availability" | "employee-load";

export const managerAgentPrompts: Array<{ id: ManagerAgentPromptId; label: string }> = [
  { id: "overview", label: "מה דורש תשומת לב?" },
  { id: "long-loans", label: "איזה ציוד מושאל זמן רב?" },
  { id: "low-availability", label: "איפה הזמינות נמוכה?" },
  { id: "employee-load", label: "אצל מי נמצא הציוד?" },
];

const DAY_IN_MS = 86_400_000;

const categoryNames: Record<EquipmentCategory, { singular: string; plural: string }> = {
  laptop: { singular: "מחשב נייד", plural: "מחשבים ניידים" },
  monitor: { singular: "מסך", plural: "מסכים" },
  projector: { singular: "מקרן", plural: "מקרנים" },
  recording: { singular: "פריט ציוד הקלטה", plural: "פריטי ציוד הקלטה" },
};

const categoryOrder: EquipmentCategory[] = ["laptop", "monitor", "projector", "recording"];

function elapsedDays(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return 0;
  return Math.max(0, Math.floor((Date.now() - timestamp) / DAY_IN_MS));
}

function getActiveLoans(equipment: EquipmentItem[], loans: Loan[]) {
  const equipmentIds = new Set(equipment.map((item) => item.id));
  return loans.filter((loan) => loan.status === "active" && equipmentIds.has(loan.equipmentId));
}

function getEmployeeLoanCounts(activeLoans: Loan[]) {
  const counts = new Map<string, number>();
  for (const loan of activeLoans) {
    counts.set(loan.employeeId, (counts.get(loan.employeeId) ?? 0) + 1);
  }
  return counts;
}

function formatItemCount(count: number) {
  return count === 1 ? "פריט אחד" : `${count} פריטים`;
}

function collectManagerInsights(
  equipment: EquipmentItem[],
  loans: Loan[],
  users: User[],
): Insight[] {
  const equipmentById = new Map(equipment.map((item) => [item.id, item]));
  const activeLoans = getActiveLoans(equipment, loans);
  const insights: Insight[] = [];

  const longLoans = activeLoans
    .map((loan) => ({ loan, days: elapsedDays(loan.borrowedAt) }))
    .filter(({ days }) => days > 7)
    .sort((first, second) => second.days - first.days || first.loan.id.localeCompare(second.loan.id));

  if (longLoans.length > 0) {
    const longest = longLoans[0];
    const longestItem = equipmentById.get(longest.loan.equipmentId);
    const countText = longLoans.length === 1
      ? "פריט אחד מושאל כבר יותר מ־7 ימים."
      : `${longLoans.length} פריטים מושאלים כבר יותר מ־7 ימים.`;
    const longestText = longest.days >= 14 && longestItem
      ? ` הוותיק שבהם, ${longestItem.name}, מושאל כבר ${longest.days} ימים.`
      : "";

    insights.push({
      id: "long-loans",
      severity: "warning",
      title: "ציוד מושאל זמן רב",
      description: `${countText}${longestText}`,
      priority: 90,
      action: { label: "הצג השאלות", type: "long-loans" },
    });
  }

  const unavailableCount = equipment.filter((item) => item.status === "unavailable").length;
  if (unavailableCount > 0) {
    insights.push({
      id: "unavailable",
      severity: "warning",
      title: "ציוד שאינו זמין",
      description: unavailableCount === 1
        ? "פריט אחד אינו זמין כרגע."
        : `${unavailableCount} פריטים אינם זמינים כרגע.`,
      priority: 80,
      action: { label: "הצג ציוד", type: "unavailable" },
    });
  }

  for (const category of categoryOrder) {
    const categoryItems = equipment.filter((item) => item.category === category);
    if (categoryItems.length < 2) continue;

    const availableCount = categoryItems.filter((item) => item.status === "available").length;
    if (availableCount > 1) continue;

    const names = categoryNames[category];
    insights.push({
      id: `low-availability-${category}`,
      severity: availableCount === 0 ? "critical" : "warning",
      title: availableCount === 0 ? "אין זמינות בקטגוריה" : "זמינות נמוכה",
      description: availableCount === 0
        ? `אין כרגע ${names.plural} זמינים במלאי.`
        : `נשאר רק ${names.singular} אחד זמין כרגע.`,
      priority: availableCount === 0 ? 100 : 70,
      action: { label: "הצג ציוד", type: "low-availability", value: category },
    });
  }

  const activeLoansByEmployee = getEmployeeLoanCounts(activeLoans);

  for (const user of users) {
    const count = activeLoansByEmployee.get(user.id) ?? 0;
    if (count < 3) continue;

    insights.push({
      id: `employee-load-${user.id}`,
      severity: count >= 4 ? "warning" : "info",
      title: "ריכוז ציוד אצל עובד",
      description: `אצל ${user.name} נמצאים כרגע ${count} פריטים.`,
      priority: count >= 4 ? 65 : 55,
      action: { label: "הצג השאלות", type: "employee-load", value: user.id },
    });
  }

  return insights
    .sort((first, second) => second.priority - first.priority || first.id.localeCompare(second.id));
}

export function generateManagerInsights(
  equipment: EquipmentItem[],
  loans: Loan[],
  users: User[],
): Insight[] {
  return collectManagerInsights(equipment, loans, users).slice(0, 3);
}

export function getManagerAgentReply(
  promptId: ManagerAgentPromptId,
  equipment: EquipmentItem[],
  loans: Loan[],
  users: User[],
): ManagerAgentReply {
  const activeLoans = getActiveLoans(equipment, loans);
  const allInsights = collectManagerInsights(equipment, loans, users);
  const insights = allInsights.slice(0, 3);

  if (promptId === "long-loans") {
    const insight = allInsights.find((item) => item.id === "long-loans");
    return insight
      ? { text: insight.description, action: insight.action }
      : { text: "אין כרגע ציוד שמושאל יותר מ־7 ימים." };
  }

  if (promptId === "low-availability") {
    const lowAvailability = allInsights.filter((item) => item.id.startsWith("low-availability-"));
    return lowAvailability.length > 0
      ? {
          text: lowAvailability.map((item) => item.description).join("\n"),
          action: lowAvailability[0].action,
        }
      : { text: "לא זיהיתי כרגע קטגוריה עם זמינות נמוכה." };
  }

  if (promptId === "employee-load") {
    const counts = getEmployeeLoanCounts(activeLoans);
    const employeeLoads = users
      .map((user) => ({ user, count: counts.get(user.id) ?? 0 }))
      .filter(({ count }) => count > 0)
      .sort((first, second) => second.count - first.count || first.user.name.localeCompare(second.user.name, "he"));
    if (employeeLoads.length === 0) return { text: "אין כרגע ציוד מושאל אצל עובדים." };

    return {
      text: employeeLoads.slice(0, 3).map(({ user, count }) => `${user.name}: ${formatItemCount(count)}`).join("\n"),
      action: { label: "הצג השאלות", type: "employee-load" },
    };
  }

  if (promptId === "overview") {
    if (insights.length === 0) return { text: "הכול נראה תקין כרגע. אין נושאים חריגים שדורשים טיפול." };
    return {
      text: `מצאתי ${insights.length} נושאים שכדאי לבדוק:\n${insights.map((insight, index) => `${index + 1}. ${insight.title} — ${insight.description}`).join("\n")}`,
      action: insights[0].action,
    };
  }

  return { text: "לא נמצאה תשובה מתאימה." };
}

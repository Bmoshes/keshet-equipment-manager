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

export function generateManagerInsights(
  equipment: EquipmentItem[],
  loans: Loan[],
  users: User[],
): Insight[] {
  const equipmentById = new Map(equipment.map((item) => [item.id, item]));
  const activeLoans = loans.filter(
    (loan) => loan.status === "active" && equipmentById.has(loan.equipmentId),
  );
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

  const activeLoansByEmployee = new Map<string, number>();
  for (const loan of activeLoans) {
    activeLoansByEmployee.set(loan.employeeId, (activeLoansByEmployee.get(loan.employeeId) ?? 0) + 1);
  }

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
    .sort((first, second) => second.priority - first.priority || first.id.localeCompare(second.id))
    .slice(0, 3);
}

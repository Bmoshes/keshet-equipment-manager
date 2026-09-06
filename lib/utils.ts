import type { EquipmentCategory, EquipmentStatus } from "./types";

export const statusLabels: Record<EquipmentStatus, string> = { available: "זמין", borrowed: "מושאל", unavailable: "לא זמין" };
export const categoryLabels: Record<EquipmentCategory, string> = { laptop: "מחשב נייד", monitor: "מסך", projector: "מקרן", recording: "ציוד הקלטה" };

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(value));
}

export function loanDuration(value: string) {
  const elapsedDays = loanDurationDays(value);
  if (elapsedDays === 0) return "מהיום";
  if (elapsedDays === 1) return "כבר יום אחד";
  return `כבר ${elapsedDays} ימים`;
}

export function loanDurationDays(value: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { EquipmentItem, Loan, User } from "@/lib/types";
import {
  getManagerAgentReply,
  managerAgentPrompts,
  type Insight,
  type ManagerAgentReply,
  type ManagerAgentPromptId,
} from "@/lib/insights-agent";
import { ChatIcon, CloseIcon, SparkIcon } from "@/components/ui/Icons";

type InsightAction = NonNullable<Insight["action"]>;
type ChatMessage = ManagerAgentReply & { id: number; role: "agent" | "user" };

const welcomeMessage: ChatMessage = {
  id: 0,
  role: "agent",
  text: "שלום, אני סוכן התובנות של מנהל הציוד. בחרו נושא לבדיקה ואציג תמונת מצב עדכנית.",
};

export function ManagerAgentChat({
  equipment,
  loans,
  users,
  insightCount,
  onAction,
}: {
  equipment: EquipmentItem[];
  loans: Loan[];
  users: User[];
  insightCount: number;
  onAction: (action: InsightAction) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const firstSuggestionRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(1);
  const titleId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    window.requestAnimationFrame(() => firstSuggestionRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, open]);

  const runPrompt = (promptId: ManagerAgentPromptId, label: string) => {
    const reply = getManagerAgentReply(promptId, equipment, loans, users);
    const userMessage: ChatMessage = {
      id: nextMessageId.current++,
      role: "user",
      text: label,
    };
    const agentMessage: ChatMessage = {
      id: nextMessageId.current++,
      role: "agent",
      ...reply,
    };
    setMessages((current) => [...current, userMessage, agentMessage]);
  };

  const handleAction = (action: InsightAction) => {
    setOpen(false);
    window.requestAnimationFrame(() => onAction(action));
  };

  return (
    <>
      {open && (
        <aside
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(42rem,calc(100dvh-7rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift sm:left-auto sm:right-5 sm:w-[24rem]"
          style={{ animation: "scale-in 180ms ease-out", transformOrigin: "bottom right" }}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-l from-brand-50 to-white px-4 py-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
              <SparkIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 id={titleId} className="font-extrabold">סוכן תובנות</h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-bold text-brand-700 ring-1 ring-brand-100">דמו</span>
              </div>
              <p className="text-xs text-slate-500">מבוסס על נתוני המלאי הנוכחיים</p>
            </div>
            <button type="button" className="icon-button shrink-0" onClick={() => setOpen(false)} aria-label="סגירת הצ׳אט">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-4" aria-live="polite">
            <div className="space-y-3">
              {messages.map((message) => {
                const action = message.action;
                return (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 shadow-sm ${message.role === "user" ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                      {message.role === "agent" && action && (
                        <button
                          type="button"
                          className="mt-2 min-h-9 rounded-lg bg-brand-50 px-3 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
                          onClick={() => handleAction(action)}
                        >
                          {action.label}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <p className="mb-2 px-1 text-xs font-bold text-slate-500">מה תרצה לבדוק?</p>
            <div className="grid grid-cols-2 gap-2" aria-label="שאלות זמינות">
              {managerAgentPrompts.map((prompt, index) => (
                <button
                  key={prompt.id}
                  ref={index === 0 ? firstSuggestionRef : undefined}
                  type="button"
                  className="min-h-11 rounded-xl border border-brand-100 bg-brand-50/70 px-3 py-2 text-xs font-bold leading-4 text-brand-700 transition hover:border-brand-300 hover:bg-brand-100"
                  onClick={() => runPrompt(prompt.id, prompt.label)}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="fixed bottom-5 right-4 z-[60] inline-flex min-h-14 items-center gap-2 rounded-full bg-ink px-4 font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-800 sm:right-5"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "סגירת סוכן התובנות" : "פתיחת סוכן התובנות"}
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <ChatIcon className="h-5 w-5" />}
        <span>{open ? "סגור" : "שאל את הסוכן"}</span>
        {!open && insightCount > 0 && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-amber-400 px-1.5 text-xs font-extrabold text-amber-950" aria-label={`${insightCount} תובנות זמינות`}>
            {insightCount}
          </span>
        )}
      </button>
    </>
  );
}

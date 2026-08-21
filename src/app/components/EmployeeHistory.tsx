import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { TopBar } from "./TopBar";
import type { Punch, PunchMap, AdjustmentRequest, TopBarCallbacks } from "../App";

interface EmployeeHistoryProps {
  punchMap: PunchMap;
  employeeName: string;
  onAdjustmentRequest: (req: AdjustmentRequest) => void;
  topBar: TopBarCallbacks;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function computeWorkedHours(punches: Punch[]): string | null {
  const entrada = punches.find((p) => p.type === "Entrada");
  const saida = punches.find((p) => p.type === "Saída");
  if (!entrada || !saida) return null;
  const [eh, em] = entrada.time.split(":").map(Number);
  const [sh, sm] = saida.time.split(":").map(Number);
  const totalMin = (sh * 60 + sm) - (eh * 60 + em) - 60; // subtract 1h lunch
  if (totalMin <= 0) return null;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${m > 0 ? `${String(m).padStart(2, "0")}m` : ""}`;
}

function computeHourBank(punches: Punch[]): string | null {
  const worked = computeWorkedHours(punches);
  if (!worked) return null;
  const match = worked.match(/(\d+)h(\d+)?/);
  if (!match) return null;
  const h = parseInt(match[1]);
  const m = parseInt(match[2] || "0");
  const totalMin = h * 60 + m - 480; // vs 8h standard
  if (totalMin === 0) return "0h00 (exato)";
  const sign = totalMin > 0 ? "+" : "-";
  const abs = Math.abs(totalMin);
  return `${sign}${Math.floor(abs / 60)}h${String(abs % 60).padStart(2, "0")}m`;
}

export function EmployeeHistory({ punchMap, employeeName, onAdjustmentRequest, topBar }: EmployeeHistoryProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [adjustNotes, setAdjustNotes] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();

  const getDayPunches = (day: number): Punch[] =>
    (punchMap[dateKey(viewYear, viewMonth, day)] || []).filter(
      (p) => p.employee === employeeName
    );

  const selectedPunches = getDayPunches(selectedDay);
  const selectedKey = dateKey(viewYear, viewMonth, selectedDay);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(1);
    setShowAdjustForm(false);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(1);
    setShowAdjustForm(false);
  };

  const goToToday = () => {
    setViewYear(todayYear);
    setViewMonth(todayMonth);
    setSelectedDay(todayDate);
    setShowAdjustForm(false);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setShowAdjustForm(false);
    setAdjustNotes("");
    setAdjustSuccess(false);
  };

  const isPastOrToday =
    viewYear < todayYear ||
    (viewYear === todayYear && viewMonth < todayMonth) ||
    (viewYear === todayYear && viewMonth === todayMonth && selectedDay <= todayDate);

  const handleSubmitAdjust = () => {
    if (!adjustNotes.trim()) return;
    onAdjustmentRequest({
      id: `adj-${Date.now()}`,
      date: selectedKey,
      employee: employeeName,
      notes: adjustNotes.trim(),
      status: "pending",
      createdAt: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
    setAdjustSuccess(true);
    setAdjustNotes("");
    setTimeout(() => {
      setShowAdjustForm(false);
      setAdjustSuccess(false);
    }, 2000);
  };

  // Hour bank summary for visible month
  let totalBankMin = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const punches = getDayPunches(d);
    if (punches.length === 4) {
      const [eh, em] = punches.find((p) => p.type === "Entrada")!.time.split(":").map(Number);
      const [sh, sm] = punches.find((p) => p.type === "Saída")!.time.split(":").map(Number);
      totalBankMin += (sh * 60 + sm) - (eh * 60 + em) - 60 - 480;
    }
  }
  const bankSign = totalBankMin >= 0 ? "+" : "-";
  const bankAbs = Math.abs(totalBankMin);
  const bankDisplay = `${bankSign}${Math.floor(bankAbs / 60)}h${String(bankAbs % 60).padStart(2, "0")}m`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Histórico" {...topBar} />

      <div className="px-6 py-6 space-y-6">
        {/* Hour Bank Summary */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary mb-1">Banco de Horas — {MONTH_NAMES[viewMonth]}</p>
            <p className={`text-lg font-light ${totalBankMin >= 0 ? "text-primary" : "text-secondary"}`}>
              {bankDisplay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary mb-1">Dias trabalhados</p>
            <p className="text-lg font-light">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((d) => getDayPunches(d).length > 0).length}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="bg-transparent border-0 cursor-pointer p-1">
              <ChevronLeft size={18} className="text-primary" />
            </button>
            <h3 className="text-sm font-medium">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button onClick={nextMonth} className="bg-transparent border-0 cursor-pointer p-1">
              <ChevronRight size={18} className="text-primary" />
            </button>
          </div>
          <div className="flex justify-end mb-2">
            <button onClick={goToToday} className="text-xs text-secondary bg-transparent border-0 cursor-pointer">
              Hoje
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <div key={i} className="text-xs text-secondary text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isToday = viewYear === todayYear && viewMonth === todayMonth && day === todayDate;
              const isSelected = day === selectedDay;
              const hasPunches = getDayPunches(day).length > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`relative text-sm py-2 rounded border-0 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary text-white font-medium"
                      : isToday
                      ? "border border-primary text-primary font-medium bg-transparent"
                      : "bg-transparent text-foreground hover:bg-background"
                  }`}
                >
                  {day}
                  {hasPunches && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Registros — {String(selectedDay).padStart(2, "0")}/{String(viewMonth + 1).padStart(2, "0")}/{viewYear}
            </h3>
            {isPastOrToday && selectedPunches.length > 0 && !showAdjustForm && (
              <button
                onClick={() => setShowAdjustForm(true)}
                className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1"
              >
                Ajustar <ChevronRight size={14} />
              </button>
            )}
          </div>

          {selectedPunches.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-sm border border-border p-4 text-center text-sm text-secondary">
              Nenhum registro neste dia
            </div>
          ) : (
            <>
              {selectedPunches.map((punch) => (
                <div
                  key={punch.id}
                  className="bg-surface rounded-lg shadow-sm border border-border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium">{punch.type}</span>
                  </div>
                  <span className="text-sm text-secondary">{punch.time}</span>
                </div>
              ))}
              {computeWorkedHours(selectedPunches) && (
                <div className="text-xs text-secondary text-right px-1">
                  Total trabalhado: {computeWorkedHours(selectedPunches)} &nbsp;|&nbsp; Banco: {computeHourBank(selectedPunches)}
                </div>
              )}
            </>
          )}

          {/* Adjustment Form */}
          {showAdjustForm && (
            <div className="bg-surface rounded-lg shadow-sm border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Solicitar Ajuste</h4>
                <button
                  onClick={() => { setShowAdjustForm(false); setAdjustNotes(""); }}
                  className="bg-transparent border-0 cursor-pointer p-0"
                >
                  <X size={18} className="text-secondary" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-secondary">Registros atuais:</p>
                {selectedPunches.map((p) => (
                  <div key={p.id} className="text-xs flex justify-between py-1 border-b border-border last:border-0">
                    <span>{p.type}</span>
                    <span className="text-secondary">{p.time}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs text-secondary mb-1">
                  Motivo / horários corretos
                </label>
                <textarea
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Ex: Esqueci de registrar. Entrada às 08:05 e saída às 17:15."
                />
              </div>

              {adjustSuccess ? (
                <p className="text-xs text-primary text-center font-medium">
                  Solicitação enviada! Aguardando aprovação do gestor.
                </p>
              ) : (
                <button
                  onClick={handleSubmitAdjust}
                  disabled={!adjustNotes.trim()}
                  className="w-full py-2 bg-primary text-white rounded text-sm font-medium border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Enviar Solicitação
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

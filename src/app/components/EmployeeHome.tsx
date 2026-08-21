import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { TopBar } from "./TopBar";
import type { Punch, TopBarCallbacks } from "../App";

interface EmployeeHomeProps {
  todayPunches: Punch[];
  onAddPunch: () => void;
  onNavigateToHistory: () => void;
  topBar: TopBarCallbacks;
}

const PUNCH_LABELS = ["Entrada", "Saída p/ Almoço", "Retorno do Almoço", "Saída"];

const UPCOMING_HOLIDAYS = [
  { date: "2026-09-07", name: "Independência do Brasil" },
  { date: "2026-10-12", name: "Nossa Sra. Aparecida" },
  { date: "2026-11-02", name: "Finados" },
  { date: "2026-11-15", name: "Proclamação da República" },
  { date: "2026-12-25", name: "Natal" },
];

function journeyStatus(count: number): string {
  if (count === 0) return "Nenhum registro hoje";
  if (count === 1) return "Em jornada";
  if (count === 2) return "Em intervalo de almoço";
  if (count === 3) return "Retornou do almoço";
  return "Jornada concluída";
}

export function EmployeeHome({ todayPunches, onAddPunch, onNavigateToHistory, topBar }: EmployeeHomeProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      setCurrentDate(
        now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const isComplete = todayPunches.length >= 4;
  const nextLabelIndex = Math.min(todayPunches.length, PUNCH_LABELS.length - 1);
  const todayISO = new Date().toISOString().split("T")[0];
  const holidays = UPCOMING_HOLIDAYS.filter((h) => h.date >= todayISO).slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Home" {...topBar} />

      <div className="px-6 py-6 space-y-6">
        {/* Date */}
        <div className="text-center">
          <p className="text-sm text-secondary capitalize">{currentDate}</p>
        </div>

        {/* Clock + Punch Button */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-6 text-center">
          <div className="text-5xl font-light mb-2 tracking-tight">{currentTime}</div>
          <p className="text-xs text-secondary mb-6">{journeyStatus(todayPunches.length)}</p>
          <button
            onClick={onAddPunch}
            disabled={isComplete}
            className={`w-full max-w-xs mx-auto block py-3 rounded text-sm font-medium border-0 transition-opacity ${
              isComplete
                ? "bg-border text-secondary cursor-not-allowed opacity-60"
                : "bg-primary text-white cursor-pointer hover:opacity-90"
            }`}
          >
            {isComplete ? "Jornada Concluída" : `Bater Ponto — ${PUNCH_LABELS[nextLabelIndex]}`}
          </button>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Calendário</h3>
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-secondary bg-transparent border-0 cursor-pointer"
            >
              Detalhar
            </button>
          </div>
          <div className="space-y-2">
            {holidays.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm">{h.name}</span>
                <span className="text-sm text-secondary">
                  {new Date(h.date + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Punches */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-secondary">
            Registros de hoje ({todayPunches.length})
          </h3>
          {todayPunches.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-sm border border-border p-4 text-center text-sm text-secondary">
              Nenhum registro ainda. Clique em &quot;Bater Ponto&quot; para começar.
            </div>
          ) : (
            todayPunches.map((punch) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

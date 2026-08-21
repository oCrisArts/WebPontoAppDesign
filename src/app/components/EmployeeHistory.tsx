import { Calendar, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";

export function EmployeeHistory() {
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const selectedDay = 15;

  const dayRecords = [
    { type: "Entrada - Início", time: "12:00" },
    { type: "Entrada - Almoço", time: "12:00" },
    { type: "Saída - Almoço", time: "12:00" },
    { type: "Saída - Almorelras", time: "18:00" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Histórico" />

      <div className="px-6 py-6 space-y-6">
        {/* Calendar Card */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Fevereiro 2026</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer">
              Hoje
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
              <div
                key={index}
                className="text-xs text-secondary text-center py-1"
              >
                {day}
              </div>
            ))}
            {monthDays.map((day) => (
              <button
                key={day}
                className={`text-sm py-2 rounded border-0 cursor-pointer ${
                  day === selectedDay
                    ? "bg-primary text-white font-medium"
                    : "bg-transparent text-primary hover:bg-background"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Registros do dia 15</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1">
              Exportar
              <ChevronRight size={14} />
            </button>
          </div>

          {dayRecords.map((record, index) => (
            <div
              key={index}
              className="bg-surface rounded-lg shadow-sm border border-border p-4 flex items-center justify-between"
            >
              <span className="text-sm">{record.type}</span>
              <span className="text-sm text-secondary">{record.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { TopBar } from "./TopBar";

export function EmployeeHome() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayPunches = [
    { type: "Entrada", time: "08:00" },
    { type: "Almoço", time: "12:00" },
    { type: "Retorno", time: "13:00" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Historio" />

      <div className="px-6 py-6 space-y-6">
        {/* Data Card */}
        <div className="text-center mb-2">
          <p className="text-sm text-secondary">{currentDate}</p>
        </div>

        {/* Main Clock Card */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-6 text-center">
          <div className="text-5xl font-light mb-6 tracking-tight">{currentTime}</div>
          <button className="w-full max-w-xs mx-auto py-3 bg-primary text-white rounded text-sm font-medium border-0 cursor-pointer hover:bg-opacity-90 transition-opacity">
            Bater Ponto
          </button>
          <p className="text-xs text-secondary mt-3">Event de tempo de ponto</p>
        </div>

        {/* Calendar Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Calendário</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer">
              Detalhar
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Feriada Ponto</span>
              <span className="text-sm text-secondary">02:09</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Feriada Alamelras</span>
              <span className="text-sm text-secondary">Criamento</span>
            </div>
          </div>
        </div>

        {/* Today's Punches */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-secondary">Registros de hoje</h3>
          {todayPunches.map((punch, index) => (
            <div
              key={index}
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
        </div>
      </div>
    </div>
  );
}
import { useState, useMemo } from "react";
import { Users, Clock, TrendingUp, ChevronRight, X } from "lucide-react";
import { TopBar } from "./TopBar";
import type { PunchMap, Punch, TopBarCallbacks } from "../App";

interface ManagerDashboardProps {
  punchMap: PunchMap;
  topBar: TopBarCallbacks;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getWeekDays(): { label: string; key: string }[] {
  const today = new Date();
  const result: { label: string; key: string }[] = [];
  // Mon–Fri of current week
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push({ label: DAY_LABELS[d.getDay()], key: dateKey(d) });
  }
  return result;
}

function computeTeamHoursForDay(punches: Punch[]): number {
  const employees = [...new Set(punches.map((p) => p.employee))];
  let totalMin = 0;
  for (const emp of employees) {
    const empPunches = punches.filter((p) => p.employee === emp);
    const entrada = empPunches.find((p) => p.type === "Entrada");
    const saida = empPunches.find((p) => p.type === "Saída");
    if (entrada && saida) {
      const [eh, em] = entrada.time.split(":").map(Number);
      const [sh, sm] = saida.time.split(":").map(Number);
      totalMin += (sh * 60 + sm) - (eh * 60 + em) - 60;
    } else if (entrada) {
      // In progress — estimate 8h
      totalMin += 480;
    }
  }
  return Math.round(totalMin / 60);
}

function WeeklyBarChart({ data }: { data: { day: string; hours: number }[] }) {
  const svgW = 320;
  const svgH = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.hours), 1);
  const yTicks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];
  const uniqueYTicks = [...new Set(yTicks)];
  const barW = (chartW / data.length) * 0.5;
  const gap = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: "block" }} aria-label="Horas por dia">
      {uniqueYTicks.map((t) => {
        const y = padT + chartH - (t / maxVal) * chartH;
        return (
          <g key={`grid-${t}`}>
            <line x1={padL} x2={svgW - padR} y1={y} y2={y} stroke="#e0e0e0" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={10} fill="#757575">{t}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = Math.max((d.hours / maxVal) * chartH, 2);
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + chartH - barH;
        return (
          <g key={`bar-${d.day}-${i}`}>
            <rect x={x} y={y} width={barW} height={barH} fill="#212121" rx={3} ry={3} />
            <text x={x + barW / 2} y={svgH - padB + 16} textAnchor="middle" fontSize={11} fill="#757575">
              {d.day}
            </text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#757575">
              {d.hours > 0 ? `${d.hours}h` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ManagerDashboard({ punchMap, topBar }: ManagerDashboardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const todayStr = dateKey(new Date());
  const todayPunches = punchMap[todayStr] || [];
  const weekDays = getWeekDays();

  const weekData = useMemo(() =>
    weekDays.map(({ label, key }) => ({
      day: label,
      hours: computeTeamHoursForDay(punchMap[key] || []),
    })),
    [punchMap, weekDays]
  );

  const activeEmployees = [...new Set(todayPunches.map((p) => p.employee))].length;

  const delaysToday = useMemo(() => {
    const employees = [...new Set(todayPunches.map((p) => p.employee))];
    return employees.filter((emp) => {
      const entrada = todayPunches.find((p) => p.employee === emp && p.type === "Entrada");
      if (!entrada) return false;
      const [h, m] = entrada.time.split(":").map(Number);
      return h * 60 + m > 510; // after 08:30
    }).length;
  }, [todayPunches]);

  const overtimeHours = useMemo(() => {
    let total = 0;
    for (const [, punches] of Object.entries(punchMap)) {
      const employees = [...new Set(punches.map((p) => p.employee))];
      for (const emp of employees) {
        const empP = punches.filter((p) => p.employee === emp);
        const entrada = empP.find((p) => p.type === "Entrada");
        const saida = empP.find((p) => p.type === "Saída");
        if (entrada && saida) {
          const [eh, em] = entrada.time.split(":").map(Number);
          const [sh, sm] = saida.time.split(":").map(Number);
          const worked = (sh * 60 + sm) - (eh * 60 + em) - 60;
          if (worked > 480) total += worked - 480;
        }
      }
    }
    return Math.floor(total / 60);
  }, [punchMap]);

  const recentActivity = [...todayPunches]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 4);

  const allActivity = [...todayPunches].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Dashboard" {...topBar} />

      <div className="px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Ativos Hoje", value: String(activeEmployees), unit: "pessoas" },
            { icon: Clock, label: "Atrasos Hoje", value: String(delaysToday), unit: "pessoas" },
            { icon: TrendingUp, label: "Horas Extras", value: `${overtimeHours}h`, unit: "acumuladas" },
          ].map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-surface rounded-lg shadow-sm border border-border p-4 text-center">
                <Icon size={24} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-light mb-1">{kpi.value}</div>
                <div className="text-xs text-secondary">{kpi.unit}</div>
              </div>
            );
          })}
        </div>

        {/* Chart Card */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Horas Trabalhadas — Semana Atual</h3>
            <button
              onClick={() => setShowDetailModal(true)}
              className="text-xs text-secondary bg-transparent border-0 cursor-pointer"
            >
              Detalhar
            </button>
          </div>
          <WeeklyBarChart data={weekData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Atividade Recente</h3>
            <button
              onClick={() => setShowActivityModal(true)}
              className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1"
            >
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-secondary text-center py-2">Nenhuma atividade hoje</p>
            ) : recentActivity.map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">{activity.type}</div>
                  <div className="text-xs text-secondary">{activity.employee}</div>
                </div>
                <div className="text-xs text-secondary">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
          <div className="bg-surface w-full rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Detalhamento — Semana Atual</h3>
              <button onClick={() => setShowDetailModal(false)} className="bg-transparent border-0 cursor-pointer p-0">
                <X size={22} className="text-secondary" />
              </button>
            </div>
            <div className="space-y-3">
              {weekDays.map(({ label, key }, i) => {
                const dayPunches = punchMap[key] || [];
                const hours = weekData[i].hours;
                const employees = [...new Set(dayPunches.map((p) => p.employee))];
                return (
                  <div key={key} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-sm text-secondary">{hours}h total equipe</span>
                    </div>
                    {employees.map((emp) => {
                      const empP = dayPunches.filter((p) => p.employee === emp);
                      const entrada = empP.find((p) => p.type === "Entrada");
                      const saida = empP.find((p) => p.type === "Saída");
                      return (
                        <div key={emp} className="text-xs flex justify-between text-secondary py-0.5">
                          <span>{emp}</span>
                          <span>
                            {entrada?.time ?? "—"} → {saida?.time ?? "em curso"}
                          </span>
                        </div>
                      );
                    })}
                    {employees.length === 0 && (
                      <p className="text-xs text-secondary">Sem registros</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* All Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
          <div className="bg-surface w-full rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Todas as marcações — Hoje</h3>
              <button onClick={() => setShowActivityModal(false)} className="bg-transparent border-0 cursor-pointer p-0">
                <X size={22} className="text-secondary" />
              </button>
            </div>
            <div className="space-y-3">
              {allActivity.length === 0 ? (
                <p className="text-sm text-secondary text-center py-4">Nenhuma marcação hoje</p>
              ) : allActivity.map((activity, index) => (
                <div
                  key={`${activity.id}-${index}`}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium">{activity.employee}</div>
                    <div className="text-xs text-secondary">{activity.type}</div>
                  </div>
                  <div className="text-sm font-medium">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

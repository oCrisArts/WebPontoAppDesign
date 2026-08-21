import { Users, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";

function WeeklyBarChart({ data }: { data: { day: string; hours: number }[] }) {
  const svgW = 320;
  const svgH = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.hours));
  const yTicks = [0, 50, 100, 150, 200].filter((t) => t <= maxVal + 20);
  const barW = (chartW / data.length) * 0.5;
  const gap = chartW / data.length;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      style={{ display: "block" }}
      aria-label="Horas por dia da semana"
    >
      {/* grid lines */}
      {yTicks.map((t) => {
        const y = padT + chartH - (t / (maxVal + 20)) * chartH;
        return (
          <g key={`grid-${t}`}>
            <line x1={padL} x2={svgW - padR} y1={y} y2={y} stroke="#e0e0e0" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={10} fill="#757575">
              {t}
            </text>
          </g>
        );
      })}

      {/* bars + x-axis labels */}
      {data.map((d, i) => {
        const barH = (d.hours / (maxVal + 20)) * chartH;
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + chartH - barH;
        return (
          <g key={`bar-${d.day}`}>
            <rect x={x} y={y} width={barW} height={barH} fill="#212121" rx={4} ry={4} />
            <text
              x={x + barW / 2}
              y={svgH - padB + 16}
              textAnchor="middle"
              fontSize={11}
              fill="#757575"
            >
              {d.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ManagerDashboard() {
  const kpis = [
    { icon: Users, label: "Funcionários Ativos", value: "24", unit: "ativos" },
    { icon: Clock, label: "Atrasos Hoje", value: "3", unit: "pessoas" },
    { icon: TrendingUp, label: "Horas Extras", value: "48h", unit: "acumuladas" },
  ];

  const weekData = [
    { day: "Seg", hours: 180 },
    { day: "Ter", hours: 165 },
    { day: "Qua", hours: 190 },
    { day: "Qui", hours: 175 },
    { day: "Sex", hours: 185 },
  ];

  const recentActivity = [
    { time: "12:00", description: "Entrada - Início", employee: "João Silva" },
    { time: "12:00", description: "Entrada - Almoço", employee: "Maria Santos" },
    { time: "12:00", description: "Saída - Almoço", employee: "Pedro Costa" },
    { time: "18:00", description: "Saída - Almoreíras", employee: "Ana Oliveira" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Dashboard" />

      <div className="px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-surface rounded-lg shadow-sm border border-border p-4 text-center"
              >
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
            <h3 className="text-sm font-medium">Horas Trabalhadas vs. Esperadas</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer">
              Detalhar
            </button>
          </div>
          <WeeklyBarChart data={weekData} />
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Atividade Recente</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1">
              Ver tudo
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">{activity.description}</div>
                  <div className="text-xs text-secondary">{activity.employee}</div>
                </div>
                <div className="text-xs text-secondary">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
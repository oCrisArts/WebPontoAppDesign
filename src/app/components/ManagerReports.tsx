import { Search, Calendar, Download, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";

export function ManagerReports() {
  const reports = [
    {
      title: "Relatório de Frequência",
      period: "Janeiro 2026",
      status: "Disponível",
    },
    {
      title: "Horas Extras",
      period: "Última Semana",
      status: "Disponível",
    },
    {
      title: "Análise de Produtividade",
      period: "Último Mês",
      status: "Gerando...",
    },
  ];

  const auditLogs = [
    { date: "06/02/2026", action: "Login realizado", user: "Admin" },
    { date: "06/02/2026", action: "Exportação de relatório", user: "João Silva" },
    { date: "05/02/2026", action: "Alteração de configuração", user: "Admin" },
    { date: "05/02/2026", action: "Cadastro de funcionário", user: "Maria Santos" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Relatórios" />

      <div className="px-6 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar funcionário..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Date Range Picker */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Período</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1">
              <Calendar size={14} />
              Selecionar
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span>01/02/2026</span>
            <span>até</span>
            <span>06/02/2026</span>
          </div>
        </div>

        {/* Available Reports */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Relatórios Disponíveis</h3>
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-surface rounded-lg shadow-sm border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">{report.title}</h4>
                  <p className="text-xs text-secondary">{report.period}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs ${
                      report.status === "Disponível"
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.status === "Disponível" && (
                    <button className="bg-transparent border-0 cursor-pointer p-0">
                      <Download size={20} className="text-primary" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Trail */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Logs do Sistema</h3>
            <button className="text-xs text-secondary bg-transparent border-0 cursor-pointer flex items-center gap-1">
              Ver todos
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {auditLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <div className="text-sm">{log.action}</div>
                  <div className="text-xs text-secondary mt-1">{log.user}</div>
                </div>
                <div className="text-xs text-secondary">{log.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
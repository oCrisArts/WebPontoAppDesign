import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { TopBar } from "./TopBar";
import type { PunchMap, TopBarCallbacks } from "../App";

interface ManagerReportsProps {
  punchMap: PunchMap;
  topBar: TopBarCallbacks;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function exportCSV(punchMap: PunchMap, year: number, month: number, monthName: string) {
  const rows: string[][] = [["Data", "Funcionário", "Tipo", "Hora"]];
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;

  for (const [dateStr, punches] of Object.entries(punchMap)) {
    if (!dateStr.startsWith(prefix)) continue;
    const [, , d] = dateStr.split("-");
    for (const punch of [...punches].sort((a, b) => a.time.localeCompare(b.time))) {
      rows.push([
        `${d}/${String(month + 1).padStart(2, "0")}/${year}`,
        punch.employee,
        punch.type,
        punch.time,
      ]);
    }
  }

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `webponto-${year}-${String(month + 1).padStart(2, "0")}-${monthName}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ManagerReports({ punchMap, topBar }: ManagerReportsProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [searchQuery, setSearchQuery] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear((y) => y - 1); }
    else setSelectedMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear((y) => y + 1); }
    else setSelectedMonth((m) => m + 1);
  };

  const prefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;

  const monthPunches = useMemo(() => {
    const result: typeof punchMap[string] = [];
    for (const [dateStr, punches] of Object.entries(punchMap)) {
      if (dateStr.startsWith(prefix)) result.push(...punches);
    }
    return result;
  }, [punchMap, prefix]);

  const employees = useMemo(() => {
    const set = new Set(monthPunches.map((p) => p.employee));
    return [...set].sort();
  }, [monthPunches]);

  const filteredEmployees = employees.filter((e) =>
    e.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const employeeSummary = (empName: string) => {
    const empPunches = monthPunches.filter((p) => p.employee === empName);
    const days = new Set(
      Object.entries(punchMap)
        .filter(([k]) => k.startsWith(prefix))
        .filter(([, punches]) => punches.some((p) => p.employee === empName))
        .map(([k]) => k)
    ).size;
    return { days, punches: empPunches.length };
  };

  const totalPunches = monthPunches.length;

  const auditLogs = useMemo(() => {
    return [...monthPunches]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6)
      .map((p) => {
        const dateStr = Object.entries(punchMap).find(([, punches]) => punches.includes(p))?.[0] ?? "";
        const [, , d] = dateStr.split("-");
        return { date: `${d}/${String(selectedMonth + 1).padStart(2, "0")}/${selectedYear}`, action: `${p.type}`, user: p.employee };
      });
  }, [monthPunches, punchMap, selectedMonth, selectedYear]);

  const handleExport = () => {
    exportCSV(punchMap, selectedYear, selectedMonth, MONTH_NAMES[selectedMonth]);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Relatórios" {...topBar} />

      <div className="px-6 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar funcionário..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Period Selector */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <h3 className="text-sm font-medium mb-3">Período</h3>
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="bg-transparent border-0 cursor-pointer p-1">
              <ChevronLeft size={18} className="text-primary" />
            </button>
            <span className="text-sm font-medium">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <button onClick={nextMonth} className="bg-transparent border-0 cursor-pointer p-1">
              <ChevronRight size={18} className="text-primary" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-secondary border-t border-border pt-3">
            <span>{employees.length} funcionários · {totalPunches} registros</span>
            <button
              onClick={handleExport}
              disabled={totalPunches === 0}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded text-xs border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              {exportSuccess ? "Exportado!" : "Exportar CSV"}
            </button>
          </div>
        </div>

        {/* Employee Summary */}
        {filteredEmployees.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Funcionários no Período</h3>
            {filteredEmployees.map((emp) => {
              const { days, punches } = employeeSummary(emp);
              return (
                <div key={emp} className="bg-surface rounded-lg shadow-sm border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-1">{emp}</h4>
                      <p className="text-xs text-secondary">{days} dia(s) trabalhado(s) · {punches} registros</p>
                    </div>
                    <span className="text-xs text-primary">Disponível</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredEmployees.length === 0 && searchQuery && (
          <p className="text-sm text-secondary text-center py-4">Nenhum funcionário encontrado</p>
        )}

        {/* Audit Trail */}
        <div className="bg-surface rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Logs do Sistema</h3>
          </div>
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-secondary text-center py-2">Sem registros no período</p>
            ) : auditLogs.map((log, index) => (
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

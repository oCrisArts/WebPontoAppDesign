import { Home, BarChart2, Menu, FileText } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: "employee" | "manager";
}

export function BottomNav({ activeTab, onTabChange, role }: BottomNavProps) {
  const employeeTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "historico", label: "Histórico", icon: FileText },
    { id: "mais", label: "Mais", icon: Menu },
  ];

  const managerTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "relatorios", label: "Relatórios", icon: BarChart2 },
    { id: "mais", label: "Mais", icon: Menu },
  ];

  const tabs = role === "employee" ? employeeTabs : managerTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 bg-transparent border-0 cursor-pointer"
            >
              <Icon
                size={24}
                className={isActive ? "text-primary" : "text-secondary"}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary font-medium" : "text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

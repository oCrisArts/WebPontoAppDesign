import { User, HelpCircle, Bell, LogOut, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";
import type { TopBarCallbacks } from "../App";

interface EmployeeMoreProps {
  onLogout: () => void;
  topBar: TopBarCallbacks;
}

export function EmployeeMore({ onLogout, topBar }: EmployeeMoreProps) {
  const menuItems = [
    { icon: User, label: "Perfil", action: topBar.onProfileClick },
    { icon: Bell, label: "Notificações", action: topBar.onNotificationsClick },
    { icon: HelpCircle, label: "Ajuda", action: () => {} },
    { icon: LogOut, label: "Sair", action: onLogout },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Mais" {...topBar} />

      <div className="px-6 py-6">
        <div className="bg-surface rounded-lg shadow-sm border border-border divide-y divide-border">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 bg-transparent border-0 cursor-pointer hover:bg-background transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-secondary" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

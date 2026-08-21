import { User, Bell, Users, Download, Settings, LogOut, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";
import type { TopBarCallbacks } from "../App";

interface ManagerMoreProps {
  onLogout: () => void;
  topBar: TopBarCallbacks;
}

export function ManagerMore({ onLogout, topBar }: ManagerMoreProps) {
  const menuSections = [
    {
      title: "Conta",
      items: [
        { icon: User, label: "Perfil", action: topBar.onProfileClick },
        { icon: Bell, label: "Notificações", action: topBar.onNotificationsClick },
      ],
    },
    {
      title: "Gestão",
      items: [
        { icon: Users, label: "Gestão de Equipe", action: () => {} },
        { icon: Download, label: "Exportar Folha (PDF/CSV)", action: () => {} },
      ],
    },
    {
      title: "Sistema",
      items: [
        { icon: Settings, label: "Configurações do Sistema", action: () => {} },
        { icon: LogOut, label: "Sair", action: onLogout },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Mais" {...topBar} />

      <div className="px-6 py-6 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-xs text-secondary mb-3 px-2">{section.title}</h3>
            <div className="bg-surface rounded-lg shadow-sm border border-border divide-y divide-border">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
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
        ))}
      </div>
    </div>
  );
}

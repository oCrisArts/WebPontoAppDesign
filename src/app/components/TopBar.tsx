import { User, Bell, Wifi, Signal, Battery } from "lucide-react";
import logo from "figma:asset/2264bf02f8cb778bc21bf077f3b9a7d23931ddd3.png";
import type { TopBarCallbacks } from "../App";

interface TopBarProps extends TopBarCallbacks {
  title: string;
}

export function TopBar({ title, onProfileClick, onNotificationsClick, hasUnread }: TopBarProps) {
  return (
    <div className="bg-surface border-b border-border">
      <div className="flex items-center justify-between px-6 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Signal size={12} className="text-primary" />
          <Wifi size={12} className="text-primary" />
        </div>
        <div className="flex items-center gap-1">
          <Battery size={12} className="text-primary" />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onProfileClick}
            className="bg-transparent border-0 cursor-pointer p-0"
            aria-label="Perfil"
          >
            <User size={24} className="text-primary" />
          </button>
          <button
            onClick={onNotificationsClick}
            className="bg-transparent border-0 cursor-pointer p-0 relative"
            aria-label="Notificações"
          >
            <Bell size={24} className="text-primary" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

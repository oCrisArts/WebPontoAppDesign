import { X, Bell } from "lucide-react";
import type { AppNotification } from "../App";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
}

export function NotificationsPanel({ notifications, onClose }: NotificationsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
      <div className="bg-surface w-full rounded-t-2xl p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Notificações</h2>
          <button onClick={onClose} className="bg-transparent border-0 cursor-pointer p-0">
            <X size={22} className="text-secondary" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Bell size={40} className="text-secondary opacity-40" />
            <p className="text-sm text-secondary">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between py-4 gap-3 ${!n.read ? "bg-background -mx-6 px-6" : ""}`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {!n.read && (
                    <span className="mt-1.5 w-2 h-2 min-w-[8px] bg-primary rounded-full" />
                  )}
                  <div className={!n.read ? "" : "ml-5"}>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-secondary mt-0.5">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { BottomNav } from "./components/BottomNav";
import { EmployeeHome } from "./components/EmployeeHome";
import { EmployeeHistory } from "./components/EmployeeHistory";
import { EmployeeMore } from "./components/EmployeeMore";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { ManagerReports } from "./components/ManagerReports";
import { ManagerMore } from "./components/ManagerMore";
import { ProfileModal } from "./components/ProfileModal";
import { NotificationsPanel } from "./components/NotificationsPanel";

export interface Punch {
  id: string;
  type: string;
  time: string;
  timestamp: number;
  employee: string;
}

export type PunchMap = Record<string, Punch[]>;

export interface UserProfile {
  name: string;
  email: string;
  role: "employee" | "manager";
}

export interface AppNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AdjustmentRequest {
  id: string;
  date: string;
  employee: string;
  notes: string;
  status: "pending";
  createdAt: string;
}

export interface TopBarCallbacks {
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  hasUnread: boolean;
}

const PUNCH_TYPES = ["Entrada", "Saída Almoço", "Retorno Almoço", "Saída"];

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey(): string {
  return dateKey(new Date());
}

function createSeedData(): PunchMap {
  const teamEmployees = [
    { name: "João Silva", delayMin: 0 },
    { name: "Maria Santos", delayMin: 22 },
    { name: "Pedro Costa", delayMin: 5 },
    { name: "Ana Oliveira", delayMin: 38 },
    { name: "Francisco Chico", delayMin: 0 },
  ];

  const map: PunchMap = {};
  const today = new Date();

  for (let daysBack = 1; daysBack <= 7; daysBack++) {
    const d = new Date(today);
    d.setDate(today.getDate() - daysBack);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;

    const key = dateKey(d);
    map[key] = [];

    for (const emp of teamEmployees) {
      const eMin = 480 + emp.delayMin;
      const eH = Math.floor(eMin / 60);
      const eM = eMin % 60;
      const entradaTime = `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}`;

      map[key].push({
        id: `${key}-${emp.name}-1`,
        type: "Entrada",
        time: entradaTime,
        timestamp: d.getTime(),
        employee: emp.name,
      });
      map[key].push({ id: `${key}-${emp.name}-2`, type: "Saída Almoço", time: "12:00", timestamp: d.getTime(), employee: emp.name });
      map[key].push({ id: `${key}-${emp.name}-3`, type: "Retorno Almoço", time: "13:00", timestamp: d.getTime(), employee: emp.name });
      map[key].push({ id: `${key}-${emp.name}-4`, type: "Saída", time: "17:00", timestamp: d.getTime(), employee: emp.name });
    }
  }

  // Today: seed team entries (except chico, who starts fresh)
  const todayPunches: Punch[] = [];
  const todayStr = todayKey();
  for (const emp of teamEmployees.filter((e) => e.name !== "Francisco Chico")) {
    const eMin = 480 + emp.delayMin;
    const eH = Math.floor(eMin / 60);
    const eM = eMin % 60;
    const entradaTime = `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}`;
    todayPunches.push({ id: `${todayStr}-${emp.name}-1`, type: "Entrada", time: entradaTime, timestamp: today.getTime(), employee: emp.name });
    if (emp.name === "João Silva" || emp.name === "Pedro Costa") {
      todayPunches.push({ id: `${todayStr}-${emp.name}-2`, type: "Saída Almoço", time: "12:00", timestamp: today.getTime(), employee: emp.name });
      todayPunches.push({ id: `${todayStr}-${emp.name}-3`, type: "Retorno Almoço", time: "13:00", timestamp: today.getTime(), employee: emp.name });
    }
  }
  if (todayPunches.length > 0) {
    map[todayStr] = todayPunches;
  }

  return map;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "", email: "", role: "employee" });
  const [activeTab, setActiveTab] = useState("home");
  const [punchMap, setPunchMap] = useState<PunchMap>(createSeedData);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "n1", message: "Maria Santos chegou com 22min de atraso", time: "08:22", read: false },
    { id: "n2", message: "Ana Oliveira chegou com 38min de atraso", time: "08:38", read: false },
    { id: "n3", message: "Lembrete: verificar registros pendentes", time: "09:00", read: true },
  ]);
  const [adjustmentRequests, setAdjustmentRequests] = useState<AdjustmentRequest[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogin = (role: "employee" | "manager") => {
    setUserProfile(
      role === "manager"
        ? { name: "Admin Gestor", email: "admin@webponto.com", role: "manager" }
        : { name: "Francisco Chico", email: "chico@webponto.com", role: "employee" }
    );
    setIsLoggedIn(true);
    setActiveTab(role === "employee" ? "home" : "dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("home");
  };

  const handleAddPunch = useCallback(() => {
    const key = todayKey();
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setPunchMap((prev) => {
      const existing = (prev[key] || []).filter((p) => p.employee === "Francisco Chico");
      const typeIndex = Math.min(existing.length, PUNCH_TYPES.length - 1);
      const newPunch: Punch = {
        id: `${key}-chico-${Date.now()}`,
        type: PUNCH_TYPES[typeIndex],
        time,
        timestamp: Date.now(),
        employee: "Francisco Chico",
      };
      setNotifications((n) => [
        { id: String(Date.now()), message: `Ponto registrado: ${newPunch.type} às ${time}`, time, read: false },
        ...n,
      ]);
      return { ...prev, [key]: [...(prev[key] || []), newPunch] };
    });
  }, []);

  const handleAdjustmentRequest = useCallback((req: AdjustmentRequest) => {
    setAdjustmentRequests((prev) => [req, ...prev]);
  }, []);

  const hasUnread = notifications.some((n) => !n.read);

  const topBar: TopBarCallbacks = {
    onProfileClick: () => setShowProfile(true),
    onNotificationsClick: () => {
      setShowNotifications(true);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    },
    hasUnread,
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const todayStr = todayKey();
  const chicoPunchesToday = (punchMap[todayStr] || []).filter((p) => p.employee === "Francisco Chico");

  const renderContent = () => {
    if (userProfile.role === "employee") {
      switch (activeTab) {
        case "home":
          return (
            <EmployeeHome
              todayPunches={chicoPunchesToday}
              onAddPunch={handleAddPunch}
              onNavigateToHistory={() => setActiveTab("historico")}
              topBar={topBar}
            />
          );
        case "historico":
          return (
            <EmployeeHistory
              punchMap={punchMap}
              employeeName="Francisco Chico"
              onAdjustmentRequest={handleAdjustmentRequest}
              topBar={topBar}
            />
          );
        case "mais":
          return <EmployeeMore onLogout={handleLogout} topBar={topBar} />;
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case "dashboard":
          return <ManagerDashboard punchMap={punchMap} topBar={topBar} />;
        case "relatorios":
          return <ManagerReports punchMap={punchMap} topBar={topBar} />;
        case "mais":
          return <ManagerMore onLogout={handleLogout} topBar={topBar} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} role={userProfile.role} />
      {showProfile && (
        <ProfileModal
          profile={userProfile}
          onUpdate={setUserProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

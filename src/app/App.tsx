import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { BottomNav } from "./components/BottomNav";
import { EmployeeHome } from "./components/EmployeeHome";
import { EmployeeHistory } from "./components/EmployeeHistory";
import { EmployeeMore } from "./components/EmployeeMore";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { ManagerReports } from "./components/ManagerReports";
import { ManagerMore } from "./components/ManagerMore";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"employee" | "manager">("employee");
  const [activeTab, setActiveTab] = useState("home");

  const handleLogin = (role: "employee" | "manager") => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab(role === "employee" ? "home" : "dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("employee");
    setActiveTab("home");
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (userRole === "employee") {
      switch (activeTab) {
        case "home":
          return <EmployeeHome />;
        case "historico":
          return <EmployeeHistory />;
        case "mais":
          return <EmployeeMore onLogout={handleLogout} />;
        default:
          return <EmployeeHome />;
      }
    } else {
      switch (activeTab) {
        case "dashboard":
          return <ManagerDashboard />;
        case "relatorios":
          return <ManagerReports />;
        case "mais":
          return <ManagerMore onLogout={handleLogout} />;
        default:
          return <ManagerDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        role={userRole}
      />
    </div>
  );
}

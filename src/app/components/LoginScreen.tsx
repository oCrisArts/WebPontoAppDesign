import { useState } from "react";
import { Wifi, Signal, Battery } from "lucide-react";
import logo from "figma:asset/2264bf02f8cb778bc21bf077f3b9a7d23931ddd3.png";

interface LoginScreenProps {
  onLogin: (role: "employee" | "manager") => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação específica de credenciais
    if (username === "admin" && password === "admin") {
      onLogin("manager");
    } else if (username === "chico" && password === "chico") {
      onLogin("employee");
    } else {
      alert("Credenciais inválidas. Use admin/admin ou chico/chico");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-1">
          <Signal size={14} className="text-primary" />
          <Wifi size={14} className="text-primary" />
        </div>
        <div className="flex items-center gap-1">
          <Battery size={14} className="text-primary" />
        </div>
      </div>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
            <h1 className="text-2xl">Web Ponto</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-xs text-secondary mb-2">Usuário</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded bg-surface text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Usuário"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs text-secondary mb-2">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded bg-surface text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Senha"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-secondary underline bg-transparent border-0 cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded text-sm font-medium border-0 cursor-pointer hover:bg-opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 space-y-1">
            <p className="text-xs text-hint text-center">
              Administrador: <span className="font-medium">admin</span> / <span className="font-medium">admin</span>
            </p>
            <p className="text-xs text-hint text-center">
              Funcionário: <span className="font-medium">chico</span> / <span className="font-medium">chico</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
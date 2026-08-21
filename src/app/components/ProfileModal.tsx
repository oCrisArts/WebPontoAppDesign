import { useState } from "react";
import { X, User } from "lucide-react";
import type { UserProfile } from "../App";

interface ProfileModalProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
}

export function ProfileModal({ profile, onUpdate, onClose }: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onUpdate({ ...profile, name: name.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end">
      <div className="bg-surface w-full rounded-t-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Perfil</h2>
          <button onClick={onClose} className="bg-transparent border-0 cursor-pointer p-0">
            <X size={22} className="text-secondary" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center">
            <User size={40} className="text-secondary" />
          </div>
          <span className="text-xs text-secondary capitalize">
            {profile.role === "manager" ? "Administrador" : "Funcionário"}
          </span>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-secondary mb-1">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-secondary mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-secondary mb-1">Nova senha (opcional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixe em branco para manter"
              className="w-full px-4 py-3 bg-background border border-border rounded text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {saved ? (
          <p className="text-sm text-primary text-center font-medium">Perfil atualizado com sucesso!</p>
        ) : (
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-3 bg-primary text-white rounded text-sm font-medium border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Salvar alterações
          </button>
        )}
      </div>
    </div>
  );
}

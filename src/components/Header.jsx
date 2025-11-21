import { LogOut } from "lucide-react";

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b border-white/10 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Logo" className="w-8 h-8" />
          <div>
            <p className="text-white font-semibold">Follow-up Tracker</p>
            <p className="text-xs text-blue-200/70">Stay on top of daily progress</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-white/90 font-medium">{user.name}</p>
              <p className="text-xs text-blue-200/70">{user.role.toUpperCase()}</p>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";

export default function AuthGate({ onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        const user = { id: data.id, name, email, role };
        localStorage.setItem("user", JSON.stringify(user));
        onAuth(user);
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (e) {
      alert("Server error. Please check backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) onAuth(JSON.parse(cached));
  }, [onAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-semibold mb-4">Welcome</h2>
        <p className="text-blue-200/80 mb-6 text-sm">Create a quick profile to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full rounded-md px-3 py-2 bg-slate-800 border border-white/10 text-white" />
          </div>
          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-md px-3 py-2 bg-slate-800 border border-white/10 text-white" />
          </div>
          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-md px-3 py-2 bg-slate-800 border border-white/10 text-white">
              <option value="employee">Employee</option>
              <option value="core">Core Team</option>
            </select>
          </div>
          <button disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 transition-colors">
            {loading ? "Creating..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

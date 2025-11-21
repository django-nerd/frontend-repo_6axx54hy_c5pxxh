import { useEffect, useMemo, useState } from "react";

export default function CoreDashboard({ user }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [due, setDue] = useState("");
  const [items, setItems] = useState([]);
  const [daily, setDaily] = useState([]);

  const filteredDaily = useMemo(() => daily.filter(d => !selected || d.user_id === selected), [daily, selected]);

  async function refresh() {
    const res = await fetch(`${baseUrl}/api/users?role=employee`);
    const users = await res.json();
    setEmployees(users);

    const res2 = await fetch(`${baseUrl}/api/followups`);
    const its = await res2.json();
    setItems(its);

    const res3 = await fetch(`${baseUrl}/api/daily?limit=100`);
    const d = await res3.json();
    setDaily(d);
  }

  useEffect(() => { refresh(); }, []);

  async function assign(e) {
    e.preventDefault();
    if (!selected) return alert("Select an employee");
    const payload = { title, details, assigned_to: selected, assigned_by: user.id, due_date: due || null, status: "open" };
    const res = await fetch(`${baseUrl}/api/followups`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      setTitle(""); setDetails(""); setDue("");
      refresh();
    } else {
      alert("Failed to create follow-up");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-white text-2xl font-semibold mb-4">Core Team Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">Assign Follow-up</h3>
          <form onSubmit={assign} className="space-y-3">
            <select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white">
              <option value="">Select employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.department || 'General'}</option>)}
            </select>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Details" className="w-full h-24 bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2">Assign</button>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">All Follow-ups</h3>
          <div className="space-y-2 max-h-72 overflow-auto pr-2">
            {items.length === 0 && <p className="text-blue-200/70 text-sm">No follow-ups yet</p>}
            {items.map(it => (
              <div key={it.id} className="p-3 rounded bg-slate-800 border border-white/10">
                <p className="text-white font-medium">{it.title}</p>
                {it.details && <p className="text-blue-200/80 text-sm">{it.details}</p>}
                <p className="text-blue-200/60 text-xs mt-1">Assignee: {employees.find(e=>e.id===it.assigned_to)?.name || it.assigned_to}</p>
                {it.due_date && <p className="text-blue-200/60 text-xs">Due: {it.due_date}</p>}
                <p className="text-blue-200/60 text-xs">Status: {it.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
        <h3 className="text-white font-medium mb-3">Recent Daily Updates</h3>
        <div className="space-y-2 max-h-72 overflow-auto pr-2">
          {filteredDaily.length === 0 && <p className="text-blue-200/70 text-sm">No updates yet</p>}
          {filteredDaily.map(u => (
            <div key={u.id} className="p-3 rounded bg-slate-800 border border-white/10">
              <p className="text-white">{u.work_summary}</p>
              {(u.blockers || u.plan_next) && <p className="text-blue-200/80 text-sm">{u.blockers ? `Blockers: ${u.blockers} `: ''}{u.plan_next ? `| Plan: ${u.plan_next}`:''}</p>}
              <p className="text-blue-200/60 text-xs mt-1">Status: {u.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

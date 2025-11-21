import { useEffect, useState } from "react";

export default function EmployeeDashboard({ user }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [summary, setSummary] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("on-track");
  const [updates, setUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);

  async function fetchData() {
    const res = await fetch(`${baseUrl}/api/daily?user_id=${user.id}`);
    const daily = await res.json();
    setUpdates(daily);

    const res2 = await fetch(`${baseUrl}/api/followups?assigned_to=${user.id}&status=open`);
    const t = await res2.json();
    setTasks(t);
  }

  useEffect(() => { fetchData(); }, []);

  async function submitDaily(e) {
    e.preventDefault();
    const payload = { user_id: user.id, work_summary: summary, blockers, plan_next: plan, status };
    const res = await fetch(`${baseUrl}/api/daily`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      setSummary(""); setBlockers(""); setPlan(""); setStatus("on-track");
      fetchData();
    } else {
      alert("Failed to submit daily update");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-white text-2xl font-semibold mb-4">Your Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">Submit Daily Update</h3>
          <form onSubmit={submitDaily} className="space-y-3">
            <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Work summary" className="w-full h-24 bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <input value={blockers} onChange={e=>setBlockers(e.target.value)} placeholder="Blockers" className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <input value={plan} onChange={e=>setPlan(e.target.value)} placeholder="Plan for next day" className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white" />
            <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-md p-2 text-white">
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="blocked">Blocked</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2">Submit</button>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">Open Follow-ups</h3>
          <ul className="space-y-2">
            {tasks.length === 0 && <li className="text-blue-200/70 text-sm">No open items</li>}
            {tasks.map((t) => (
              <li key={t.id} className="p-3 rounded bg-slate-800 border border-white/10">
                <p className="text-white font-medium">{t.title}</p>
                {t.details && <p className="text-blue-200/80 text-sm">{t.details}</p>}
                {t.due_date && <p className="text-blue-200/60 text-xs mt-1">Due: {t.due_date}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
        <h3 className="text-white font-medium mb-3">Recent Daily Updates</h3>
        <div className="space-y-2 max-h-64 overflow-auto pr-2">
          {updates.length === 0 && <p className="text-blue-200/70 text-sm">No updates yet</p>}
          {updates.map(u => (
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

import { useEffect } from "react";
import { useDevConnectStore } from "../store/useDevConnectStore";

export default function Connections() {
  const { connections, loadAll, removeConnection, error } = useDevConnectStore();

  useEffect(() => { void loadAll(); }, [loadAll]);

  return (
    <div className="space-y-3">
      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{error}</div>}
      {connections.length === 0 && <div className="text-white/60 text-sm">No connections yet</div>}
      {connections.map((c) => (
        <div key={c.id} className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-3">
            {c.peer.avatar ? <img src={c.peer.avatar} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-zinc-800" />}
            <div>
              <div className="text-white">{c.peer.name}</div>
              <div className="text-white/60 text-xs">{c.peer.title}</div>
            </div>
          </div>
          <button onClick={() => void removeConnection(c.id)} className="px-3 py-1.5 rounded-lg border border-white/15 bg-zinc-800 text-white/90">Remove</button>
        </div>
      ))}
    </div>
  );
}

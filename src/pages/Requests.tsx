import { useEffect } from "react";
import { useDevConnectStore } from "../store/useDevConnectStore";

export default function Requests() {
  const { incoming, outgoing, loadAll, acceptRequest, rejectRequest, cancelRequest, error } = useDevConnectStore();

  useEffect(() => { void loadAll(); }, [loadAll]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {error && <div className="md:col-span-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{error}</div>}

      <section>
        <h2 className="text-white text-lg mb-3">Incoming</h2>
        <div className="space-y-3">
          {incoming.length === 0 && <div className="text-white/60 text-sm">No incoming requests</div>}
          {incoming.map((r) => (
            <div key={r.id} className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                {r.from.avatar ? <img src={r.from.avatar} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-zinc-800" />}
                <div>
                  <div className="text-white">{r.from.name}</div>
                  <div className="text-white/60 text-xs">{r.from.title}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => void acceptRequest(r.id)} className="px-3 py-1.5 rounded-lg bg-[#a4f839] text-black font-semibold">Accept</button>
                <button onClick={() => void rejectRequest(r.id)} className="px-3 py-1.5 rounded-lg border border-white/15 bg-zinc-800 text-white/90">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-white text-lg mb-3">Outgoing</h2>
        <div className="space-y-3">
          {outgoing.length === 0 && <div className="text-white/60 text-sm">No outgoing requests</div>}
          {outgoing.map((r) => (
            <div key={r.id} className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                {r.toUser.avatar ? <img src={r.toUser.avatar} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-zinc-800" />}
                <div>
                  <div className="text-white">{r.toUser.name}</div>
                  <div className="text-white/60 text-xs">{r.toUser.title}</div>
                </div>
              </div>
              <button onClick={() => void cancelRequest(r.id)} className="px-3 py-1.5 rounded-lg border border-white/15 bg-zinc-800 text-white/90">Cancel</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

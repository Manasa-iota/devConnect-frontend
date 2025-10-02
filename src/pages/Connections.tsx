// src/pages/Connections.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDevConnectStore } from "../store/useDevConnectStore";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Connections() {
  const { connections, loadAll, removeConnection, loading, error } = useDevConnectStore();
  const nav = useNavigate();

  useEffect(() => { void loadAll(); }, [loadAll]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Connections</h1>
      {error && <div className="rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2 text-sm">{error}</div>}
      {loading && <div className="text-white/70">Loading…</div>}
      {!loading && connections.length === 0 && <div className="text-white/60">No connections yet</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-white/5 to-transparent" />
            <CardBody className="-mt-10">
              <div className="flex items-center gap-3">
                {c.peer.avatar ? (
                  <img src={c.peer.avatar} alt={c.peer.name} className="h-14 w-14 rounded-xl border border-white/10 object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-xl border border-white/10 bg-white/5" />
                )}
                <div>
                  <div className="font-medium">{c.peer.name}</div>
                  <div className="text-white/60 text-xs">{c.peer.title ?? "Developer"}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-white/40 text-xs">
                  Connected {new Date(c.createdAt ?? Date.now()).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => nav(`/messages/${c.peer.id}`)}>Message</Button>
                  <Button size="sm" variant="ghost" onClick={() => void removeConnection(c.id)}>Remove</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

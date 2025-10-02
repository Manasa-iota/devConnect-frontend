// src/pages/Requests.tsx
import { useEffect } from "react";
import { useDevConnectStore } from "../store/useDevConnectStore";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Requests() {
  const { incoming, outgoing, loadAll, acceptRequest, rejectRequest, cancelRequest, loading, error } =
    useDevConnectStore();

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Requests</h1>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-white/80 font-medium">Incoming</h2>
          {loading && <div className="text-white/60 text-sm">Loading…</div>}
          {!loading && incoming.length === 0 && (
            <div className="text-white/50 text-sm">No incoming requests</div>
          )}
          {incoming.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardBody className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {r.from.avatar ? (
                    <img
                      src={r.from.avatar}
                      alt={r.from.name}
                      className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/5" />
                  )}
                  <div>
                    <div className="font-medium">{r.from.name}</div>
                    <div className="text-white/60 text-xs">{r.from.title ?? "Developer"}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void acceptRequest(r.id)} size="sm">
                    Accept
                  </Button>
                  <Button onClick={() => void rejectRequest(r.id)} variant="ghost" size="sm">
                    Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-white/80 font-medium">Outgoing</h2>
          {loading && <div className="text-white/60 text-sm">Loading…</div>}
          {!loading && outgoing.length === 0 && (
            <div className="text-white/50 text-sm">No outgoing requests</div>
          )}
          {outgoing.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardBody className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {r.toUser.avatar ? (
                    <img
                      src={r.toUser.avatar}
                      alt={r.toUser.name}
                      className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/5" />
                  )}
                  <div>
                    <div className="font-medium">{r.toUser.name}</div>
                    <div className="text-white/60 text-xs">{r.toUser.title ?? "Developer"}</div>
                  </div>
                </div>
                <Button onClick={() => void cancelRequest(r.id)} variant="ghost" size="sm">
                  Cancel
                </Button>
              </CardBody>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

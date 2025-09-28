import { useEffect } from "react";
import FeedCard from "../components/FeedCard";
import { useDevConnectStore } from "../store/useDevConnectStore";

export default function Feed() {
  const { feed, loadAll, swipeLeft, swipeRight, loading, error } = useDevConnectStore();

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  return (
    <div className="flex flex-col items-center gap-4">
      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm w-full max-w-md">{error}</div>}
      {loading && <div className="text-white/70">Loading…</div>}
      {!loading && feed.length === 0 && <div className="text-white/60">No more profiles</div>}
      {feed.slice(0, 5).map((u) => (
        <FeedCard key={u.id} user={u} onLeft={swipeLeft} onRight={swipeRight} />
      ))}
    </div>
  );
}

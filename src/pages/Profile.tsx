import { useAuthStore } from "../store/useAuthStore";

export default function Profile() {
  const { user } = useAuthStore();
  if (!user) return <div className="text-white/70">Not signed in</div>;

  return (
    <div className="max-w-xl w-full bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-4">
        {user.avatar ? <img src={user.avatar} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-zinc-800" />}
        <div>
          <div className="text-white text-xl font-semibold">{user.name}</div>
          <div className="text-white/60">{user.title}</div>
        </div>
      </div>
      <div className="mt-4 text-white/80 text-sm">{user.bio}</div>
    </div>
  );
}

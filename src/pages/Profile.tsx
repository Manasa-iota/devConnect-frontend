import { useAuthStore } from "../store/useAuthStore";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useState } from "react";
import { api } from "../lib/apiClient";

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [title, setTitle] = useState(user?.title ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <div className="text-white/70">Not signed in</div>;

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const updated = await api<{ user: typeof user }>("/profile/edit", {
        method: "PATCH",
        body: { about:bio, photoUrl:avatar },
      });
      setUser(updated.user);
      setEditing(false);
    } catch (err) {
      setError((err as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Profile</h1>

      <Card>
        <CardBody className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {avatar ? (
            <img
              src={avatar}
              className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl border border-white/10 bg-white/5" />
          )}
          <div className="flex-1">
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-white/60">{title || "Developer"}</div>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              {bio || "Add a short bio"}
            </p>
          </div>
          <Button variant="ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Close" : "Edit"}
          </Button>
        </CardBody>
      </Card>

      {editing && (
        <Card>
          <CardBody className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-sm mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 outline-none 
                             focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Avatar URL</label>
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 outline-none 
                             focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 outline-none 
                           focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

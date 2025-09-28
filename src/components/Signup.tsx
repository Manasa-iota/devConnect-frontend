import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Signup() {
  const nav = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup({ firstName, lastName, email, password });
      nav("/login", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white text-xl font-semibold mb-1">Create account</h1>
        <p className="text-white/60 text-sm mb-6">Join devConnect</p>
        {error && <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-1">First name</label>
            <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} required className="w-full rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#a4f839]/70" />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Last name</label>
            <input value={lastName} onChange={(e)=>setLastName(e.target.value)} required className="w-full rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#a4f839]/70" />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#a4f839]/70" />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#a4f839]/70" />
          </div>
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#a4f839] text-black font-semibold py-2 disabled:opacity-60">
            {submitting ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

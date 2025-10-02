import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardBody } from "./ui/Card";
import Button from "./ui/Button";
import { EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";

export default function Signup() {
  const nav = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardBody>
          <h1 className="text-white text-xl font-semibold">Create account</h1>
          <p className="text-white/60 text-sm mb-6">Join devConnect</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                required
                className="rounded-xl bg-surface-200 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
              />
              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                required
                className="rounded-xl bg-surface-200 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
              />
            </div>

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
            />

            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeNoneIcon className="h-5 w-5 text-black" /> : <EyeOpenIcon className="h-5 w-5 text-black" />}
              </button>
            </div>

            <Button className="w-full" variant="outline" disabled={submitting}>
              {submitting ? "Creating..." : "Sign Up"}
            </Button>

            <div className="text-center text-white/60 text-sm">
              Have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

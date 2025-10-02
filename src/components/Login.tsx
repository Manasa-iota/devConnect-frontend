import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardBody } from "./ui/Card";
import Button from "./ui/Button";
import { EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";


export default function Login() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { from?: string } };
  const { login } = useAuthStore();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      nav(state?.from ?? "/", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardBody>
          <h1 className="text-white text-xl font-semibold">Sign in</h1>
          <p className="text-white/60 text-sm mb-6">Continue to devConnect</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 outline-none 
                           focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-surface-200 text-white px-3 py-2 pr-10 outline-none 
                             focus:ring-2 focus:ring-brand-primary/60 border border-white/10"
                />
                <button
  type="button"
  onClick={() => setShowPassword((s) => !s)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
>
  {showPassword ? (
    <EyeNoneIcon className="h-5 w-5 text-black" />
  ) : (
    <EyeOpenIcon className="h-5 w-5 text-black" />
  )}
</button>

              </div>
            </div>

            <Button className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-white/60 text-sm">
              No account?{" "}
              <Link to="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

// src/components/Header.tsx
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const routes: { name: string; path: string }[] = [
  { name: "Feed", path: "/" },
  { name: "Requests", path: "/requests" },
  { name: "Connections", path: "/connections" },
  { name: "Profile", path: "/profile" },
];

export default function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-16 items-center justify-between px-3 md:px-9 border-b border-white/10">
      <Link to="/" className="text-white font-semibold">devConnect</Link>
      <nav aria-label="Primary">
        <ul className="flex items-center gap-x-6 text-sm md:text-[15px]">
          {routes.map((r) => {
            const active = r.path === "/" ? pathname === "/" : pathname.startsWith(r.path);
            return (
              <li key={r.name} className={cn("relative pb-1 transition hover:text-white", { "text-white": active, "text-white/50": !active })}>
                <Link to={r.path}>{r.name}</Link>
                {active && <motion.div layoutId="header-active-link" className="bg-[#a4f839] h-[2px] w-full absolute bottom-0" />}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-white/60 text-sm hidden sm:inline-block">Hi, {user.name}</span>
            <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition">
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 rounded-lg border border-white/15 bg-zinc-800 text-white/90">Login</Link>
            <Link to="/signup" className="px-3 py-1.5 rounded-lg bg-[#a4f839] text-black font-semibold">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
}

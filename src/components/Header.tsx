import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import Button from "./ui/Button";

const routes = [
  { name: "Feed", path: "/" },
  { name: "Requests", path: "/requests" },
  { name: "Connections", path: "/connections" },
  { name: "Profile", path: "/profile" },
];

export default function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();

  const visibleRoutes = user
    ? routes // show all including Feed
    : routes.filter((r) => r.name !== "Feed"); // hide Feed if no user

  return (
    <div className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 mb-5 rounded-2xl bg-surface-100/60 backdrop-blur-xl border border-white/10 shadow-soft">
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="font-semibold text-white text-lg">devConnect</Link>

            <nav className="hidden md:block" aria-label="Primary">
              <ul className="flex items-center gap-6 text-sm">
                {visibleRoutes.map((r) => {
                  const active = r.path === "/" ? pathname === "/" : pathname.startsWith(r.path);
                  return (
                    <li
                      key={r.name}
                      className={cn("relative pb-1", {
                        "text-white": active,
                        "text-white/60": !active,
                      })}
                    >
                      <Link to={r.path} className="hover:text-white">{r.name}</Link>
                      {active && (
                        <motion.div
                          layoutId="header-active"
                          className="bg-brand-primary h-[2px] w-full absolute bottom-0 rounded-full"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="hidden sm:block text-white/70 text-sm">
                    Hi, {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

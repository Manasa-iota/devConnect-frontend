import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useLocation, Link } from "react-router-dom";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];

export default function Header() {
  const location = useLocation();
  const activePathName = location.pathname;

  return (
    <header className="flex h-full items-center justify-between px-3 pt-2 md:pt-4 sm:px-9 border-b border-white/20">
      <Link to="/">Logo</Link>

      <ul className="flex h-full text-sm md:text-[15px] gap-x-6">
        {routes.map((route) => (
          <li
            key={route.name}
            className={cn(
              "flex items-center hover:text-white transition relative pb-1 ",
              {
                "text-white": activePathName === route.path,
                "text-white/50": activePathName !== route.path,
              }
            )}
          >
            <Link to={route.path}>{route.name}</Link>
            {activePathName === route.path && (
              <motion.div
                layoutId="header-active-link"
                className="bg-[#a4f839] h-[2px] w-full absolute bottom-0"
              />
            )}
          </li>
        ))}
      </ul>
    </header>
  );
}

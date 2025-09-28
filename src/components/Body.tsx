import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Body() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-50 bg-black">
        <Header />
      </header>
      <main className="flex-1 px-3 pt-6 md:pt-8">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-4 text-center text-white/50 text-sm">© 2025 devConnect</footer>
    </div>
  );
}

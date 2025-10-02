import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Body() {
  return (
    <div className="min-h-screen flex flex-col bg-black scrollbar-hide text-white">
      
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black ">
        <Header />
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full scrollbar-hide px-4 py-8 md:py-10 ">
        <Outlet />
      </main>

      <footer className="sticky bottom-0 border-t border-white/10 py-4 text-center text-white/50 text-sm bg-black">
        © 2025 devConnect
      </footer>
    </div>
  );
}


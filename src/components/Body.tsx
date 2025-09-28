import { Outlet } from "react-router-dom"
import Header from "./Header"

export default function Body() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1 px-3 pt-24">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-4 text-center text-white/50 text-sm">
        © 2025 My App. All rights reserved.
      </footer>
    </div>
  )
}

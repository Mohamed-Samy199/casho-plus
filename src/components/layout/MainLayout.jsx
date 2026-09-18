import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — ثابتة على الشاشات الكبيرة */}
      <aside className="hidden w-64 shrink-0 border-l border-border bg-bg-surface md:block">
        <Sidebar />
      </aside>

      {/* Sidebar — off-canvas على الموبايل */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-64 bg-bg-surface">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute left-3 top-3 rounded-lg p-2 text-text-secondary hover:bg-bg-raised"
              aria-label="إغلاق القائمة"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
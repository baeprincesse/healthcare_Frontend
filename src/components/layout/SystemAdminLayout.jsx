import { Outlet } from "react-router-dom";
import SystemAdminSidebar from "../sidebar/SystemAdminSidebar.jsx";

export default function SystemAdminLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] p-4 sm:p-6">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <SystemAdminSidebar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

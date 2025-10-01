import { Outlet } from "react-router-dom";
import { OptimizedDashboardLayout } from "@/components/optimized-dashboard-layout";

export default function SettingsLayout() {
  return (
    <OptimizedDashboardLayout title="Settings">
      <div className="w-full">
        <div className="min-h-[50vh]">
          <Outlet />
        </div>
      </div>
    </OptimizedDashboardLayout>
  );
}

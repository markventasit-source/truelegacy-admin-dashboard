import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppBreadcrumbs } from "../components/ui/AppBreadcrumbs";
import { Outlet } from "@tanstack/react-router";
import { BreadcrumbProvider } from "@/context/BreadCrumbContext";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <BreadcrumbProvider>
        <main className="flex min-h-svh flex-1 flex-col overflow-hidden">
          <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <AppBreadcrumbs />
          </div>

          <div className="flex-1 p-4 bg-[#FFF] overflow-auto">
            <Outlet />
          </div>
        </main>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}

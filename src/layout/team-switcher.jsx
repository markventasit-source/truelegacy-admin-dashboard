import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "../assets/images/icon.png";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <img src={logo} alt="logo" width="42" height="28" />
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-bold">True Legacy</span>
            <span className="truncate text-xs">Enterprice</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

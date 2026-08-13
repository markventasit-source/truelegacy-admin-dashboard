import {
  LayoutDashboard,
  Bell,
  UserCog,
  NotebookText,
  UsersRound,
  MessageSquareWarning,
} from "lucide-react";

export const sidebarData = {
  navGroups: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Member Management",
          url: "/members",
          icon: UsersRound,
        },
        {
          title: "Pages",
          url: "/pages",
          icon: NotebookText,
        },
        {
          title: "Notifications",
          url: "/notifications",
          icon: Bell,
        },
        {
          title: "Enquiries",
          url: "/enquiries",
          icon: MessageSquareWarning,
        },
        {
          title: "Admin Management",
          url: "/admin-management",
          icon: UserCog,
        },
        {
          title: "Admin Logs",
          url: "/admin-logs",
          icon: UserCog,
        },
      ],
    },
  ],
};

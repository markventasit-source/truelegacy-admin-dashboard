import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

import Login from "@/pages/Login.jsx";
import Dashboard from "@/pages/dashboard/Dashboard.jsx";
import ProtectedLayout from "./ProtectedLayout";
import AdminManagement from "@/pages/AdminManagement";
import AdminLogs from "@/pages/AdminLogs";
import Notification from "@/pages/notification/Notification";
import Members from "@/pages/members/Members";
import AddMemberForm from "@/components/members/AddMemberForm";
import MemberView from "@/pages/members/MemberView";
import Pages from "@/pages/pages/Pages";
import Blogs from "@/pages/pages/Blogs";
import BlogForm from "@/components/pages/BlogForm";
import Articles from "@/pages/pages/Articles";
import ArticleForm from "@/components/pages/ArticleForm";
import Events from "@/pages/pages/Events";
import EventForm from "@/components/pages/EventForm";
import News from "@/pages/pages/News";
import NewsForm from "@/components/pages/NewsForm";
import Enquiry from "@/pages/enquiry/Enquiry";
import EnquiryView from "@/pages/enquiry/EnquiryView";
const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Login,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const protectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/members", component: Members },
  { path: "/pages", component: Pages },
  { path: "/enquiries", component: Enquiry },
  { path: "/enquiries/view/$id", component: EnquiryView },
  { path: "/pages/blogs", component: Blogs },
  { path: "/pages/blogs/edit/$id", component: BlogForm },
  { path: "/pages/add-blog", component: BlogForm },
  { path: "/pages/articles", component: Articles },
  { path: "/pages/articles/edit/$id", component: ArticleForm },
  { path: "/pages/add-article", component: ArticleForm },
  { path: "/pages/events", component: Events },
  { path: "/pages/events/edit/$id", component: EventForm },
  { path: "/pages/add-event", component: EventForm },
  { path: "/pages/news", component: News },
  { path: "/pages/news/edit/$id", component: NewsForm },
  { path: "/pages/add-news", component: NewsForm },
  { path: "/members/add", component: AddMemberForm },
  { path: "/members/edit/$id", component: AddMemberForm },
  { path: "/members/view/$id", component: MemberView },
  { path: "/notifications", component: Notification },
  { path: "/admin-management", component: AdminManagement },
  { path: "/admin-logs", component: AdminLogs },
];

const protectedRouteChildren = protectedRoutes.map(({ path, component }) =>
  createRoute({
    getParentRoute: () => protectedRoute,
    path,
    component,
  })
);

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren(protectedRouteChildren),
]);

export const router = createRouter({ routeTree });

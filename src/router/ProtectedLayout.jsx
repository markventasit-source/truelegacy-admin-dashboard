import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Layout from "@/layout/layout.jsx";

function useAuth() {
  const token = localStorage.getItem("4ZbFyedjehdkdfefejkhj");
  return { isAuthenticated: !!token };
}

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("[ProtectedLayout] redirecting to login");
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <Layout>
      <div className="flex h-screen">
        <Outlet />
      </div>
    </Layout>
  );
}

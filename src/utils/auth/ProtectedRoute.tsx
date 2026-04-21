import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useAuth } from "./AuthContext";
import { useRef } from "react";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { status, roles, refreshAuth, hasCheckedAuth } = useAuth();
  const navigate = useNavigate();

  // 🔥 trigger auth check
  const hasChecked = useRef(false);

  useEffect(() => {
    if (status === "anonymous" && !hasChecked.current) {
      hasChecked.current = true;
      refreshAuth();
    }
  }, [status]);

  // 🔥 handle routing AFTER check
  useEffect(() => {
    if (status === "checking") return;

    // ❌ not logged in AFTER check
    if (hasCheckedAuth && status === "anonymous") {
      navigate("/signin");
      return;
    }

    // 🔐 role check
    if (
      status === "authenticated" &&
      allowedRoles &&
      !allowedRoles.some((r) => roles.includes(r))
    ) {
      if (roles.includes("client")) navigate("/client");
      else if (roles.includes("coach")) navigate("/coach");
      else navigate("/");
    }
  }, [status, roles, allowedRoles, navigate]);

  // ⏳ loading
  if (status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 🚫 block render until ready
  if (status !== "authenticated") return null;

  return <>{children}</>;
};

export default ProtectedRoute;

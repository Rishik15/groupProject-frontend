import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { status, roles, refreshAuth, hasCheckedAuth, socketReady } = useAuth();

  const navigate = useNavigate();
  const hasTriggeredAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth && !hasTriggeredAuth.current) {
      hasTriggeredAuth.current = true;
      refreshAuth();
    }
  }, [hasCheckedAuth, refreshAuth]);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (status === "anonymous") {
      navigate("/signin", { replace: true });
      return;
    }

    if (
      status === "authenticated" &&
      allowedRoles &&
      !allowedRoles.some((r) => roles.includes(r))
    ) {
      if (roles.includes("admin")) {
        navigate("/admin", { replace: true });
      } else if (roles.includes("coach")) {
        navigate("/coach", { replace: true });
      } else if (roles.includes("client")) {
        navigate("/client", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [status, roles, allowedRoles, hasCheckedAuth, navigate]);

  if (
    !hasCheckedAuth ||
    status === "checking" ||
    (status === "authenticated" && !socketReady)
  ) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return <>{children}</>;
};

export default ProtectedRoute;

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { status, roles, refreshAuth, hasCheckedAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasCheckedAuth) {
      refreshAuth();
    }
  }, [hasCheckedAuth]);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (status === "anonymous") {
      navigate("/signin");
      return;
    }

    if (
      status === "authenticated" &&
      allowedRoles &&
      !allowedRoles.some((r) => roles.includes(r))
    ) {
      if (roles.includes("client")) navigate("/client");
      else if (roles.includes("coach")) navigate("/coach");
      else navigate("/");
    }
  }, [status, roles, allowedRoles, navigate, hasCheckedAuth]);

  if (!hasCheckedAuth) {
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

import { Navigate } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useAuth } from "./AuthContext";

const getDefaultRoute = (
  roles: string[],
  activeMode: string | null,
): string => {
  if (activeMode === "admin" && roles.includes("admin")) return "/admin";
  if (activeMode === "coach" && roles.includes("coach")) return "/coach";
  if (activeMode === "client" && roles.includes("client")) return "/client";

  if (roles.includes("admin")) return "/admin";
  if (roles.includes("coach")) return "/coach";
  if (roles.includes("client")) return "/client";

  return "/";
};

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { status, roles, activeMode, hasCheckedAuth } = useAuth();

  if (!hasCheckedAuth || status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/signin" replace />;
  }

  const hasAllowedRole =
    !allowedRoles || allowedRoles.some((role) => roles.includes(role));

  const activeModeAllowed =
    !allowedRoles || (!!activeMode && allowedRoles.includes(activeMode));

  if (!hasAllowedRole || !activeModeAllowed) {
    return <Navigate to={getDefaultRoute(roles, activeMode)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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

  const navigate = useNavigate();

  const hasAllowedRole =
    !allowedRoles || allowedRoles.some((role) => roles.includes(role));

  const activeModeAllowed =
    !allowedRoles || (!!activeMode && allowedRoles.includes(activeMode));

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (status === "anonymous") {
      navigate("/signin", { replace: true });
      return;
    }

    if (status === "authenticated" && (!hasAllowedRole || !activeModeAllowed)) {
      navigate(getDefaultRoute(roles, activeMode), { replace: true });
    }
  }, [
    status,
    roles,
    activeMode,
    hasAllowedRole,
    activeModeAllowed,
    hasCheckedAuth,
    navigate,
  ]);

  if (!hasCheckedAuth || status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  if (!hasAllowedRole || !activeModeAllowed) return null;

  return <>{children}</>;
};

export default ProtectedRoute;

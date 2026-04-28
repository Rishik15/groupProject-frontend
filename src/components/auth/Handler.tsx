import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";
import { updateRole } from "../../services/auth/updateRole";
import RoleSelector from "../Register/RoleSelection";
import { useAuth } from "../../utils/auth/AuthContext";

const AuthComplete = () => {
  const navigate = useNavigate();

  const {
    user,
    roles,
    status,
    hasCheckedAuth,
    coachApplicationStatus,
    setAuth,
    refreshAuth,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const finishAuth = async () => {
      if (!hasCheckedAuth || status === "checking") {
        return;
      }

      if (status === "anonymous" || !user) {
        navigate("/", { replace: true });
        return;
      }

      const currentRoles = roles ?? [];

      if (currentRoles.length === 0) {
        setShowRoleSelection(true);
        setLoading(false);
        return;
      }

      if (currentRoles.includes("admin")) {
        navigate("/admin", { replace: true });
        return;
      }

      if (currentRoles.includes("client")) {
        navigate("/client", { replace: true });
        return;
      }

      if (currentRoles.includes("coach")) {
        navigate("/coach", { replace: true });
        return;
      }

      try {
        await refreshAuth();

        if (!active) {
          return;
        }

        setLoading(false);
      } catch {
        navigate("/", { replace: true });
      }
    };

    finishAuth();

    return () => {
      active = false;
    };
  }, [hasCheckedAuth, status, user, roles, navigate, refreshAuth]);

  const handleContinue = async () => {
    if (!selectedRole || submittingRole) return;

    try {
      setSubmittingRole(true);

      const data = await updateRole(selectedRole as "coach" | "client");

      const newRoles = data.roles ?? (data.role ? [data.role] : []);

      setAuth({
        user: data.user,
        roles: newRoles,
        coachApplicationStatus:
          data.coachApplicationStatus ??
          data.coach_application_status ??
          coachApplicationStatus ??
          "none",
        coachModeActivated:
          data.coachModeActivated ?? data.coach_mode_activated ?? false,
      });

      if (selectedRole === "coach") {
        navigate("/onboarding/coach", { replace: true });
      } else {
        navigate("/onboarding/client", { replace: true });
      }
    } catch {
      navigate("/", { replace: true });
    } finally {
      setSubmittingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <section className="w-full max-w-md items-center flex flex-col px-10">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Finish setting up your account
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            Choose how you want to use the app.
          </p>

          <RoleSelector role={selectedRole} setRole={setSelectedRole} />

          <Button
            onPress={handleContinue}
            variant="primary"
            className="w-full mt-10 bg-indigo-500 hover:bg-indigo-600"
            isDisabled={!selectedRole || submittingRole}
          >
            {submittingRole ? "Saving..." : "Continue"}
          </Button>
        </section>
      </div>
    );
  }

  return null;
};

export default AuthComplete;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { getAuth } from "../../services/auth/checkAuth";
import { updateRole } from "../../services/auth/updateRole";
import RoleSelector from "../Register/RoleSelection";
import { useAuth } from "../../utils/auth/AuthContext";

const AuthComplete = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submittingRole, setSubmittingRole] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const finishAuth = async () => {
      try {
        const data = await getAuth();

        if (!data.authenticated || !data.user) {
          navigate("/", { replace: true });
          return;
        }

        const roles = data.roles ?? [];

        setAuth({
          user: data.user,
          roles,
          coachApplicationStatus: data.coachApplicationStatus ?? "rejected",
        });

        if (data.needs_onboarding) {
          setShowRoleSelection(true);
          setLoading(false);
          return;
        }

        if (roles.includes("admin")) {
          navigate("/admin", { replace: true });
          return;
        }

        if (roles.includes("client")) {
          navigate("/client", { replace: true });
          return;
        }

        if (roles.includes("coach")) {
          navigate("/coach", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch {
        navigate("/", { replace: true });
      }
    };

    finishAuth();
  }, [navigate, setAuth]);

  const handleContinue = async () => {
    if (!selectedRole || submittingRole) return;

    try {
      setSubmittingRole(true);

      const data = await updateRole(selectedRole as "coach" | "client");

      const roles = data.roles ?? (data.role ? [data.role] : []);

      setAuth({
        user: data.user,
        roles,
        coachApplicationStatus:
          data.coachApplicationStatus ??
          data.coach_application_status ??
          "rejected",
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
        Signing you in...
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

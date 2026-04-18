import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { getAuth } from "../../services/auth/checkAuth";
import { updateRole } from "../../services/auth/updateRole";
import RoleSelector from "../Register/RoleSelection";

const AuthComplete = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submittingRole, setSubmittingRole] = useState(false);
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    useEffect(() => {
        const finishAuth = async () => {
            try {
                const data = await getAuth();

                if (!data.authenticated) {
                    navigate("/", { replace: true });
                    return;
                }

                if (data.needs_onboarding) {
                    setShowRoleSelection(true);
                    setLoading(false);
                    return;
                }

                if (data.role === "coach") {
                    navigate("/coach", { replace: true });
                } else if (data.role === "client") {
                    navigate("/client", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } catch {
                navigate("/", { replace: true });
            }
        };

        finishAuth();
    }, [navigate]);

    const handleContinue = async () => {
        if (!selectedRole || submittingRole) return;

        try {
            setSubmittingRole(true);

            const data = await updateRole(selectedRole as "coach" | "client");

            if (data.role === "coach") {
                navigate("/onboarding/coach", { replace: true });
            } else if (data.role === "client") {
                navigate("/onboarding/client", { replace: true });
            } else {
                navigate("/", { replace: true });
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
            <div className="min-h-screen flex items-center justify-center px-4">
                <section className="w-full max-w-md">
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
                        className="w-full mt-6"
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
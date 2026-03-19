import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import CustomModal from "../../components/global/Modal";
import { Spinner } from "@heroui/react";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const { authenticated, role } = await getAuth();

      if (!authenticated) {
        setMessage("You must be signed in to access this page.");
        setShowModal(true);
        setLoading(false);

        setTimeout(() => {
          navigate("/signin");
        }, 1500);

        return;
      }

      if (allowedRoles && role && !allowedRoles.includes(role)) {
        setMessage("You are not authorized to access this page.");
        setShowModal(true);
        setLoading(false);

        setTimeout(() => {
          if (role === "client") navigate("/client");
          else if (role === "coach") navigate("/coach");
          else navigate("/");
        }, 1500);

        return;
      }

      setLoading(false);
    };

    verifyAuth();
  }, [allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <>
      {children}

      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Access Denied"
      >
        {message}
      </CustomModal>
    </>
  );
};

export default ProtectedRoute;

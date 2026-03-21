import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import CustomModal from "../../components/global/Modal";
import { Spinner } from "@heroui/react";

type RedirectPath = string | null;

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
  const [redirectPath, setRedirectPath] = useState<RedirectPath>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const verifyAuth = async () => {
      const { authenticated, role } = await getAuth();

      if (!isActive) return;

      if (!authenticated) {
        setMessage("You must be signed in to access this page.");
        setRedirectPath("/signin");
        setShowModal(true);
        setLoading(false);
        return;
      }

      if (allowedRoles && role && !allowedRoles.includes(role)) {
        setMessage("You are not authorized to access this page.");

        if (role === "client") setRedirectPath("/client");
        else if (role === "coach") setRedirectPath("/coach");
        else setRedirectPath("/");

        setShowModal(true);
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    verifyAuth();

    return () => {
      isActive = false;
    };
  }, [allowedRoles]);

  const handleModalClose = () => {
    setShowModal(false);

    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <>
      {!showModal && children}

      <CustomModal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Access Denied"
      >
        {message}
      </CustomModal>
    </>
  );
};

export default ProtectedRoute;

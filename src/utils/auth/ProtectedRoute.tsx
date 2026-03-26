import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import CustomModal from "../../components/global/Modal";
import { Spinner } from "@heroui/react";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const { authenticated, role, loading } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    console.log("CHECKING ACCESS...");

    if (!authenticated) {
      console.log("NOT AUTHENTICATED");
      setMessage("You must be signed in to access this page.");
      setRedirectPath("/signin");
      setShowModal(true);
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      console.log("ROLE NOT ALLOWED:", role);
      setMessage("You are not authorized to access this page.");

      if (role === "client") setRedirectPath("/client");
      else if (role === "coach") setRedirectPath("/coach");
      else setRedirectPath("/");

      setShowModal(true);
    } else {
      console.log("ACCESS GRANTED");
    }
  }, [loading, authenticated, role, allowedRoles]);

  const handleModalClose = () => {
    setShowModal(false);
    if (redirectPath) navigate(redirectPath);
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

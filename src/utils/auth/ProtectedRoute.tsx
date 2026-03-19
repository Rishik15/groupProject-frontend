import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import CustomModal from "../../components/global/Modal";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const { authenticated, role } = await getAuth();

      if (!authenticated) {
        setMessage("You must be signed in to access this page.");
        setShowModal(true);
        setIsAuth(false);
        setIsAuthorized(false);
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        setMessage("You are not authorized to access this page.");
        setShowModal(true);
        setIsAuth(true);
        setIsAuthorized(false);
      } else {
        setIsAuth(true);
        setIsAuthorized(true);
      }

      setRole(role);
      setLoading(false);
    };

    verifyAuth();
  }, [allowedRoles]);

  const handleClose = () => {
    setShowModal(false);

    if (!isAuth) {
      navigate("/signin");
    } else if (!isAuthorized) {
      if (role === "client") {
        navigate("/client");
      } else if (role === "coach") {
        navigate("/coach");
      } else {
        navigate("/");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  if (isAuth && isAuthorized) return <>{children}</>;

  return (
    <>
      <CustomModal
        isOpen={showModal}
        onClose={handleClose}
        title="Access Denied"
      >
        {message}
      </CustomModal>
    </>
  );
};

export default ProtectedRoute;

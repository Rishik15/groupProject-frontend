import { useState, useEffect } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import { useNavigate } from "react-router-dom";
import SignFooter from "../../components/SignIn/Footer";
import SignHeader from "../../components/SignIn/Header";
import SignInputs from "../../components/SignIn/Input";
import { login } from "../../services/auth/login";
import { validateSignIn } from "../../utils/auth/validateInputs";
import Modal from "../../components/global/Modal";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      const { authenticated, role } = await getAuth();

      if (!isActive) return;

      if (authenticated) {
        if (role === "coach") navigate("/coach");
        else if (role === "client") navigate("/client");
      }
    };

    checkAuth();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const errors = validateSignIn(email, password);

      if (Object.keys(errors).length > 0) {
        const message = Object.values(errors)[0];
        setModalMessage(message as string);
        setShowModal(true);
        return;
      }

      const data = await login(email, password);

      if (!data || data.error) {
        setModalMessage(data?.error || "Invalid credentials");
        setShowModal(true);
        return;
      }

      if (data.role === "coach") {
        navigate("/coach");
      } else {
        navigate("/client");
      }
    } catch (err: any) {
      let message = "Something went wrong. Please try again.";

      if (err?.response?.data?.error) {
        message = err.response.data.error;
      } else if (err?.message) {
        message = err.message;
      }

      setModalMessage(message);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <section className="full min-w-sm">
          <SignHeader />

          <SignInputs
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          <SignFooter onSubmit={handleLogin} />
        </section>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Error"
      >
        {modalMessage}
      </Modal>
    </>
  );
};

export default SignIn;

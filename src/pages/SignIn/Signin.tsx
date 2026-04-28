import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignFooter from "../../components/SignIn/Footer";
import SignHeader from "../../components/SignIn/Header";
import SignInputs from "../../components/SignIn/Input";
import { login } from "../../services/auth/login";
import { validateSignIn } from "../../utils/auth/validateInputs";
import Modal from "../../components/global/Modal";
import { useAuth } from "../../utils/auth/AuthContext";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import { startGoogleLogin } from "../../services/auth/googleLogin";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

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

      await refreshAuth();

      navigate("/auth/complete", { replace: true });
    } catch (err: any) {
      setModalMessage(
        err?.message || "Something went wrong. Please try again.",
      );
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

          <div className="flex flex-col gap-4">
            <div className="pt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-400" />
              <span className="text-[12px] text-default-500">or</span>
              <div className="h-px flex-1 bg-gray-400" />
            </div>
            <GoogleAuthButton onPress={startGoogleLogin} />
          </div>
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

import { useState } from "react";
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

      console.log("login success");

      if (data.role === "coach") {
        navigate("/coach");
      } else {
        navigate("/client");
      }
    } catch (err) {
      console.error(err);
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
